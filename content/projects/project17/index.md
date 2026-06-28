---
title: "Building a Flight Search Engine: Modeling Fares, Stops, Seats and Bundled Trips"
date: 2026-06-27
draft: false
description: "Designing the domain model behind an airline flight search engine: trip type, seat preference, price sorting, flexible versus fixed dates, nonstop versus one-stop filtering, refundable versus lowest-available fares and flight-only versus flight-and-hotel-and-car bundles."
tags: ["Rust", "Flight Search", "Travel", "API Design", "GDS", "NDC", "Aggregator", ]
categories: ["Rust", "Flight Search", "Travel", "API Design", "GDS", "NDC", "Aggregator", ]
---
A flight search form looks like a wall of checkboxes: one-way or round-trip, window or aisle, nonstop or one stop, flexible dates or a fixed date, lowest fare or fully refundable, flight only or bundled with a hotel and a car. The interesting engineering problem is not rendering those checkboxes. It is that every one of them changes which supplier APIs get called, how their responses get normalized and how the resulting offers get compared against each other, since a price quoted by an airline's NDC API and a price quoted by a GDS are not directly comparable until the search layer has normalized currency, baggage rules and fare conditions out of both. Modeling the request precisely up front is what makes that normalization tractable later.

The first decision, one-way versus round-trip, is not just a boolean flag on an otherwise identical search. A round-trip itinerary is frequently priced as a single combined fare rather than two independent one-way fares added together, because airlines file round-trip fare bases that assume the passenger returns on the same carrier alliance within a set window. Searching the two legs independently and adding their prices will sometimes produce a cheaper-looking total that does not exist as a bookable fare, so the request needs to carry trip type as a real branch in the search logic rather than a convenience flag layered on top of two one-way searches.

```rust
pub enum TripType {
    OneWay,
    RoundTrip { return_date: DateSpec },
}
```

Date handling needs the same two-mode split, between a secure, fixed date and a flexible search window. A fixed date means the passenger needs that exact departure, which is the only mode that makes sense once a hotel or car rental is bundled into the same itinerary, since hotel inventory and car inventory price against specific check-in and pickup dates rather than a range. A flexible search instead sweeps a window, typically a few days on either side of a target date and returns the cheapest fare per day, the calendar-grid view familiar from most aggregators. The two modes are different queries against the fare cache, not different presentations of the same query, because a flexible search has to fan out across several departure dates and keep only the minimum fare per day rather than resolving a single itinerary.

```rust
pub enum DateSpec {
    Fixed(NaiveDate),
    Flexible { center: NaiveDate, window_days: u8 },
}
```

Stops and cabin are the filters that most directly reshape which itineraries even exist as candidates before price enters the picture. Nonstop-only collapses the search to single-segment itineraries on routes where a carrier actually flies the city pair directly, which is a smaller set than the one-stop search, since a one-stop itinerary opens up every route reachable through any of a carrier's hub airports. A nonstop itinerary almost always carries a price premium over the cheapest one-stop alternative on the same route, so this filter is really a willingness-to-pay signal disguised as a convenience preference and the search layer needs to keep both segment counts in its candidate set before the price filter discards anything.

```rust
pub enum MaxStops {
    Nonstop,
    OneStop,
    Any,
}
```

Seat preference sits in a different layer of the system entirely from the filters above it, because window, aisle and middle availability comes from a seat map tied to a specific flight number and aircraft, not from the fare search response. A search request can carry a seat preference as a soft signal used to rank otherwise-similar itineraries, or as a quick check against typical seat map shape for a given aircraft type, but the authoritative answer only comes back once a specific flight has been selected and its live seat map is queried, which is usually a separate request to the operating carrier's inventory system.

```rust
pub enum SeatPreference {
    Window,
    Aisle,
    Middle,
    NoPreference,
}
```

Refundability is a fare-rule attribute, not a price tier, even though it is usually presented next to the price as if it were one. A lowest-available fare and a fully refundable fare on the same flight are frequently different fare basis codes filed by the same airline, with the refundable fare carrying a materially higher price in exchange for waiving the change and cancellation penalties baked into the cheaper basis code. Filtering on this dimension means reading the fare rules attached to each offer, not just sorting by price, since two offers with an identical fare can still differ in refundability depending on which fare basis the supplier happened to return for that search.

```rust
pub enum FareFlexibility {
    LowestAvailable,
    FullyRefundable,
}
```

Bundling is where the search request stops being a single query and becomes an orchestration problem across independent supplier systems. Flight-only resolves against the fare engine alone. Flight-and-car or flight-and-hotel adds exactly one more supplier call, keyed off the same origin, destination and dates already captured by the flight portion of the request. Flight, hotel and car together means three independent inventory systems have to agree on a shared date range before the bundle can be priced as a package and the discount an aggregator can offer on a bundle usually reflects a negotiated margin across all three suppliers rather than a simple sum of three separate retail prices.

```rust
pub enum Bundle {
    FlightOnly,
    FlightAndHotel,
    FlightAndCar,
    FlightHotelAndCar,
}
```

Pulling every dimension together into one request is what lets the search layer treat "competitive prices" as a sort order rather than a separate feature. Once trip type, dates, stops, cabin, seat preference, fare flexibility and bundle are all explicit fields on the same struct, ranking by price is just one sort among several the same result set supports, applied after every supplier's offers have already been normalized into a common currency and a common fare-rule shape.

```rust
pub struct FlightSearchRequest {
    pub origin: String,
    pub destination: String,
    pub trip_type: TripType,
    pub departure: DateSpec,
    pub passengers: u8,
    pub max_stops: MaxStops,
    pub seat_preference: SeatPreference,
    pub fare_flexibility: FareFlexibility,
    pub bundle: Bundle,
    pub sort: SortOrder,
}

pub enum SortOrder {
    PriceAscending,
    DurationAscending,
    DepartureTimeAscending,
}
```

None of this complexity is visible in the checkboxes themselves, which is exactly why the request model has to carry all of it explicitly. A flight search engine that gets the UI right but flattens trip type, date flexibility, refundability and bundling into a handful of loosely related query parameters will eventually return a fare that looks bookable and is not, a seat preference that silently gets ignored once the seat map loads or a bundle price that does not match what the three underlying suppliers actually charge once priced together. Getting the domain model this explicit up front is what turns "search for flights" from a single API call into a coherent system with a real chance of returning offers that hold up at checkout.
