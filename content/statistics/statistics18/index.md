---
title: "The Empirical Rule: Why 68% of Everything Falls Within One Standard Deviation"
date: 2026-06-30
draft: false
description: "The empirical rule holds that 68% of values in a normal distribution fall within one standard deviation of the mean, 95% within two and 99.7% within three. A look at how that rule and the z-score behind it turn any bell curve into a tool for calculating real-world probabilities."
tags: ["normal distribution", "empirical rule", "z-score", "statistics", "probability", "standard deviation", "continuous distributions", "t-distribution"]
categories: ["Statistics", "Education"]
math: true
---
Most of the probability questions worth asking are not about a single exact outcome but about a range. Probability distributions fall into two families: discrete distributions describe distinct, separate outcomes such as the number of children in a household, while continuous distributions describe a continuum of outcomes such as height or weight. In a continuous distribution the random variable can take on any value along that continuum and because there are infinitely many values it could assume, the probability of it landing on any one specific value is technically zero. A person's height, a test score or the weight of a blue crab pulled from a bay can fall anywhere along a continuum, so the meaningful question is never "what is the probability of exactly 70" but "what is the probability of falling between 60 and 80." That probability is the integral, the area under the distribution's curve, between those two points rather than a lookup against a single number. A probability density function is built so that this area is always positive and so that the total area under the curve from negative infinity to positive infinity always equals one.

The normal distribution is the most useful continuous distribution because it shows up everywhere real measurement happens: test scores, manufacturing tolerances, blood pressure readings, biological growth. It is not one curve but an infinite family of curves that share the same bell shape while differing in exactly two parameters, the mean (μ) and the standard deviation (σ). The curve is symmetric and centered on the mean, which in a normal distribution is also the median and the mode. Because it is continuous, there is still no way to calculate the exact probability of a single outcome; instead, probability is always calculated for a range, such as the probability that a randomly chosen value exceeds 10. Nearly all of the values in a normal distribution fall within three standard deviations of the mean, which is where the distribution earns its second name: the three-sigma rule, or the empirical rule. Roughly 68% of values fall within one standard deviation of the mean, roughly 95% fall within two standard deviations and roughly 99.7% fall within three. Because that pattern holds for every normal distribution regardless of its actual mean or spread, it turns a bell curve into a working tool rather than just a description of a shape.

The special case with a mean of zero and a standard deviation of one is called the standard normal distribution and its x-axis values are called z-scores. Probabilities for the standard normal distribution are read from a normal probability table, commonly called a z-table, which reports the area to the *left* of a given z-score. Finding the area to the right of a z-score, the probability that Z is greater than some value, means subtracting the table's value from one. Using a z-table, the probability that z falls between −1 and 1 can be worked out directly: the probability that z is less than −1 is about 0.1587 and by the symmetry of the normal curve, the probability that z is greater than 1 is also about 0.1587. Subtracting both tails from the total area gives 1 − 2(0.1587) = 0.6826, matching the roughly 68% predicted by the empirical rule.

The bridge between "some normal distribution with its own mean and standard deviation" and "the standard normal distribution with its ready-made table" is the z-score: z = (x − μ) / σ. A z-score restates any raw value as the number of standard deviations it sits above or below its own mean, which converts every normal distribution into the same standard normal distribution regardless of that distribution's original mean or spread.

That mechanism is easiest to see worked through. Suppose test scores are normally distributed with a mean (μ) of 70 and a standard deviation (σ) of 10 and the question is what percentage of students scored between 60 and 80. Converting both endpoints to z-scores gives z = (60 − 70) / 10 = −1 and z = (80 − 70) / 10 = 1. Both endpoints land exactly one standard deviation from the mean, so the empirical rule answers the question directly: about 68% of students scored between 60 and 80.

Most real values do not land on a convenient whole-number z-score, which is where the z-table earns its keep. Take the weight of a randomly selected adult blue crab, assumed based on prior research to be normally distributed with a population mean of 0.8 kg and a standard deviation of 0.3 kg and ask for the probability that a given crab weighs more than 1 kg. Replacing X with 1, μ with 0.8 and σ with 0.3 gives a z-score of (1 − 0.8) / 0.3 ≈ 0.667, a value that falls between the standard table entries for 0.66 and 0.67, roughly 0.7454 and 0.7486. Because the z-table reports the area to the left of a z-score, the probability of weighing more than 1 kg is one minus that figure, or roughly 0.252. Based on that normality assumption, a randomly selected adult blue crab has roughly a 25.2% chance of weighing more than one kilogram.

The normal distribution assumes the population standard deviation is already known, which is rarely true outside a textbook problem. When σ has to be estimated from a sample instead, the correct tool is the Student's t-distribution, a related family of unimodal, continuous distributions that varies based on its degrees of freedom. Like the normal distribution, it is used when comparing means, but its tails are thicker than the normal distribution's, particularly when the degrees of freedom are small. Those thicker tails are the honest price of added uncertainty: estimating σ from a small sample means the true spread of the data is less well known than the normal distribution assumes, so the t-distribution spreads more probability into the extremes to compensate. As the sample size grows and the degrees of freedom rise, the t-distribution's tails thin out and it converges toward the standard normal curve, which is why the two are typically taught as a pair rather than as unrelated topics.

Empirical Rule at a Glance

| Range around the mean | Share of values contained |
| --------------------- | ------------------------- |
| Mean +/- 1 SD         | ~68%                      |
| Mean +/- 2 SD         | ~95%                      |
| Mean +/- 3 SD         | ~99.7%                    |

Worked Examples

| Problem                                                | z-score(s)       | Result           |
| ------------------------------------------------------ | ---------------- | ---------------- |
| Test scores (mean 70, sd 10), P(60 < X < 80)           | z = -1 and z = 1 | ~68% of students |
| Blue crab weight (mean 0.8 kg, sd 0.3 kg), P(X > 1 kg) | z ~ 0.667        | ~25.2%           |

Common z-scores Used in Confidence Intervals

| Confidence level | Critical value (z*)  |
| ---------------- | -------------------- |
| 90%              | 1.645                |
| 95%              | 1.96                 |
| 99%              | 2.576                |

---
*Sources: standard normal (Gaussian) distribution theory and the empirical rule (68-95-99.7 rule); standard normal (z) table conventions for area-under-the-curve calculations; Student's t-distribution theory for small-sample inference when the population standard deviation is unknown.*
