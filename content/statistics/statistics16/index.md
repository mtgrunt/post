---
title: "Sports Betting: The Math Behind the Vig, the Arbitrage and the Hidden Hold"
date: 2026-06-23
draft: false
description: "A breakdown of the math behind sports betting: a standard -110 line carries a 4.76% vig, a blind two-pick player-prop parlay can hand the platform a 25% hold and confirming a real betting edge at a 53% win rate takes roughly 2,400 settled bets at 95% confidence."
tags: ["sports betting", "statistics", "probability", "expected value", "vig", "arbitrage", "Kelly Criterion", "PrizePicks", "Kalshi"]
categories: ["Statistics", "Sports"]
---
Sportsbooks are often mistaken for oracles predicting who will win a game when their actual function is closer to a market maker pricing a security: setting two sides of a bet so that money flows in on both sides and the house collects a structural fee no matter the outcome. That fee, the vig, is built into even the most ordinary bet on the board. A standard -110/-110 spread or total implies a 52.38% probability of winning on each side, since a bettor must risk $110 to win $100. Add the two sides together and the implied probabilities sum to 104.76% instead of a fair 100%, with that extra 4.76% representing the book's edge regardless of which side actually wins. For a bettor whose pick is a genuine coin flip, the expected return on a single -110 bet works out to -4.55% of the stake, the practical cost of laying down money at standard odds.

That fixed cost is also why a single point of spread, the "hook," carries outsized value in football betting. Field goals are worth 3 points and touchdowns with the extra point are worth 7, which makes a 3-point final margin meaningfully more common in NFL games than a 2-point margin or other small differentials that don't align with the sport's scoring increments. Multiple studies of historical NFL final scores have found 3 points to be the single most frequent margin of victory in the league, well ahead of any other specific number. That is the statistical reason buying or shopping for half a point around the number 3, the difference between a 2.5-point spread and a 3.5-point spread, is treated as one of the more reliably valuable moves available to a spread bettor, even after paying the vig to do it.

Variation in pricing across sportsbooks is what creates arbitrage, a bet structure with a guaranteed, riskless profit regardless of outcome. Because every sportsbook sets its own odds independently rather than referencing a shared central price, the same two-outcome event can occasionally be priced at plus money on both sides at two different books. If a bettor can find both sides of a binary outcome priced at, for example, plus-110 on two separate books, staking $100 on each side guarantees one bet wins and one loses: the winning side returns $210 against a combined $200 risked, a locked-in $10 profit, or 5%, often realized within hours rather than years. These windows tend to be narrow and short-lived because sportsbooks can legally limit or ban customers who win consistently, a power that has no real counterpart in regulated equity or options markets.

A different and often larger hidden cost shows up on player-prop "pick'em" apps that pay out a flat multiplier instead of odds tied to true probability. These platforms set lines intended to be a 50/50 over/under and advertise a simple multiplier on a correct entry rather than quoting odds directly, which makes the embedded cost much easier to overlook. Take a blind two-pick entry priced to pay 3x the stake when both legs hit: if both legs are genuinely 50/50, the entry wins 25% of the time for a $200 profit on a $100 stake and loses the full $100 the other 75% of the time. The expected value is 0.25 × $200 minus 0.75 × $100, or -$25, meaning the platform holds 25% of every dollar wagered on that structure even when the underlying picks carry no edge at all, a far steeper toll than the 4.76% built into a standard sportsbook line.

Parlays compound that toll in a way that is easy to misjudge. A common shorthand treats each additional leg as subtracting a fixed slice of ROI, but the real relationship is multiplicative: at standard -110 pricing, each leg of a true coin-flip bet returns 0.5 × 1.909 in decimal odds, or 0.9545 of the stake in expectation and that factor compounds with every leg added rather than simply stacking. A one-leg bet carries an expected return of -4.55%; by five legs, the same math compounds to roughly -20.7%, not because each leg adds a flat penalty but because the probability of winning every leg shrinks geometrically while the payout grows only in proportion to the odds multiplied together.

A real edge, once a bettor has one, still has to be sized correctly to survive its own variance. The Kelly Criterion sets the optimal bankroll fraction to stake as f* = (bp − q) / b, where b is the net decimal odds (decimal odds minus 1), p is the bettor's estimated true win probability and q is 1 − p. At -110 odds (b = 0.909) and an estimated true win probability of 55%, f* works out to about 5.5% of bankroll. Staking more than the Kelly fraction raises the long-run risk of ruin even when the edge is genuine, which is why disciplined bettors commonly stake a fraction of Kelly, often half, trading some long-run growth for materially lower bankroll swings.

Peer-to-peer exchanges and prediction markets such as Kalshi and Polymarket sit at the opposite end of the cost spectrum from flat-multiplier pick'em apps. Because bettors trade against each other rather than against a book setting both sides of the price, the frictional cost to enter a position is typically a modest trading fee rather than a built-in overround, which is part of why sharp, price-sensitive bettors increasingly route action there when a comparable market exists. The tradeoff is a thinner edge to find rather than a lower one to pay for, since the counterparty on the other side of an exchange trade is often a far more sophisticated pricer than the one setting a retail sportsbook's line.

Because any single bet is mostly noise, professional bettors track closing line value (CLV), whether their price beat the market's final price right before the game started, rather than short-term win rate as their primary measure of skill. The reason is statistical: decades of research on betting markets, beginning with studies of horse racing odds and repeated across sports betting, have documented a persistent favorite-longshot bias in which heavy favorites win slightly more often than their market-implied probability suggests while big underdogs win less often than their price implies, an effect too small to see in any one bet but large enough to shape strategy across thousands of them. Consistently beating the closing line is a much faster signal of that kind of edge than win rate, because win rate takes an enormous sample to trust.

That sample-size requirement is larger than most bettors assume. A bettor winning 53% of standard -110 bets is profitable in the long run, but after only 100 bets the 95% confidence interval around an observed 53% win rate spans roughly 43% to 63%, wide enough to contain both a loser and a strong winner. Tightening that interval to something narrow enough to actually confirm an edge takes a much larger sample and the required size grows fast as the demanded precision increases.

The scale of the market underneath all this math has grown enormous since the U.S. Supreme Court's 2018 Murphy v. NCAA decision opened the door to state-by-state legalization. Legal U.S. sports betting handle, the total amount wagered before payouts, crossed $100 billion in a single year within about five years of legalization. Industry-wide hold, the share of handle sportsbooks keep as revenue, typically runs in the 7%-9% range when blended across spreads, totals, moneylines, parlays and player props, well above the 4.76% vig on a single standard spread bet, because parlays and player props carry a much higher built-in hold than straight bets and pull the blended average up.

Put together, the math describes a hierarchy of cost rather than a single number: a standard -110 sportsbook line costs about 4.55% in expectation on a coin-flip bet, a blind two-pick flat-multiplier entry can cost 25% on the same coin-flip assumption and parlays sit between those extremes, with their true cost compounding multiplicatively rather than scaling in a straight line. None of that math determines who wins a given game, but it does determine, with much more certainty, how much a bettor without an edge can expect to give back over time and how long it takes to even know whether an edge is real.

Key Numbers at a Glance

| Metric                                                                                 | Value                           |
| -------------------------------------------------------------------------------------- | ------------------------------- |
| Standard -110/-110 line, implied vig (overround)                                       | 4.76%                           |
| Expected return on a single -110 bet, true 50/50 outcome                               | -4.55%                          |
| Decimal odds equivalent of -110                                                        | 1.909                           |
| Locked-in arbitrage profit example (two +110 lines, $100 per side)                     | $10 on $200 staked (5% return)  |
| Blind 2-pick flat-multiplier entry, implied house hold (legs at true 50/50, 3x payout) | 25%                             |
| Expected return on a 5-leg, same-odds (-110) parlay, true 50/50 legs                   | -20.7%                          |
| Kelly stake at -110 odds, 55% estimated true win probability                           | ~5.5% of bankroll               |
| 95% CI on a 53% observed win rate after 100 bets                                       | 43%-63%                         |
| U.S. legal sports betting handle, time to cross $100 billion in a year                 | ~5 years post-2018 legalization |
| Industry-wide blended sportsbook hold                                                  | ~7%-9% of handle                |

PrizePicks-Style Math: Why a "Coin-Flip" 2-Pick Entry Isn't Even Money

| Outcome on a 2-pick entry, $100 stake, 3x payout | Probability (legs at true 50/50) | Money returned       |
| ------------------------------------------------ | -------------------------------- | -------------------- |
| Both legs correct                                | 25%                              | $300 ($200 profit)   |
| At least one leg wrong                           | 75%                              | $0 ($100 loss)       |
| Expected value                                   | --                               | -$25 (-25% of stake) |

Parlay Expected Value Decay (compounding, not additive, at standard -110 odds and true 50/50 legs)

| Parlay legs      | Per-leg return factor | Cumulative expected return |
| ---------------- | --------------------- | -------------------------- |
| 1 (straight bet) | 0.9545                | -4.5%                      |
| 2                | 0.9112                | -8.9%                      |
| 3                | 0.8697                | -13.0%                     |
| 4                | 0.8302                | -17.0%                     |
| 5                | 0.7929                | -20.7%                     |

Sample Size Needed to Confirm a 53% True Win Rate (95% Confidence)

| Desired precision (± percentage points) | Bets needed |
| --------------------------------------- | ----------- |
| ±5                                      | ~380        |
| ±3                                      | ~1,060      |
| ±2                                      | ~2,400      |
| ±1                                      | ~9,600      |

---
*Sources: standard American sportsbook odds conventions for -110/-110 spread and total pricing; Kelly Criterion bankroll-management formula; binomial confidence-interval calculations for win-rate sample sizes; American Gaming Association reporting on legal U.S. sports betting handle growth following Murphy v. NCAA (2018); academic and industry research on the favorite-longshot bias in betting markets; probability and expected-value calculations performed for this analysis.*
