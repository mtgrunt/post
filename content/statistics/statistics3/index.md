---
title: "49ers Draft Intelligence: A Statistical Analysis of the Shanahan/Lynch Era"
date: 2026-01-14
draft: false
description: "Deep dive into San Francisco 49ers draft performance from 2017-2024 using custom metrics like Differential Score and Outcome-Adjusted Value."
tags: ["NFL", "49ers", "draft", "statistics", "sports analytics", "regression", "probability"]
categories: ["Statistics", "Sports"]
math: true
---

{{< katex >}}

## Introduction

The San Francisco 49ers, under head coach Kyle Shanahan and general manager John Lynch, have built one of the NFL's most competitive rosters since 2017. But how effective have they actually been in the draft?

Using custom statistical metrics, probability theory, and the Jimmy Johnson Trade Value Chart, I analyzed every 49ers draft pick from 2017-2024 to quantify their drafting efficiency and identify statistically significant patterns.

## Methodology

### Data Collection

The dataset comprises n = 58 draft picks with the following variables:

| Variable | Type | Description |
|----------|------|-------------|
| `pick` | Continuous | Overall draft position (1-262) |
| `round` | Ordinal | Draft round (1-7) |
| `career_av` | Continuous | Pro Football Reference Approximate Value |
| `pro_bowls` | Count | Number of Pro Bowl selections |
| `games_started` | Count | Career games started |
| `status` | Categorical | Outcome classification (Elite, Solid, Average, Below Average, Bust) |

### Statistical Framework

I employ three custom metrics to evaluate draft performance:

## Metric 1: Differential Score (SDS)

The SDS quantifies the deviation between draft position and pre-draft consensus:

$$SDS_i = R_i - P_i$$

Where:
- $R_i$ = Pre-draft rank for player $i$
- $P_i$ = Actual draft pick position for player $i$

**Interpretation:**
- $SDS > 0$: Value pick (drafted later than ranked)
- $SDS < 0$: Reach pick (drafted earlier than ranked)
- $SDS = 0$: Fair value pick

For the 49ers sample:

$$\bar{SDS} = \frac{1}{n}\sum_{i=1}^{n} SDS_i = -3.0$$

$$s_{SDS} = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(SDS_i - \bar{SDS})^2} = 28.7$$

The negative mean indicates the 49ers tend to reach slightly, drafting players an average of three positions earlier than consensus rankings suggest.

### 95% Confidence Interval for Mean SDS

$$CI_{95\%} = \bar{SDS} \pm t_{0.025, n-1} \cdot \frac{s}{\sqrt{n}}$$

$$CI_{95\%} = -3.0 \pm 2.002 \cdot \frac{28.7}{\sqrt{58}} = [-10.5, 4.5]$$

Since this interval contains zero, we cannot conclude the 49ers systematically reach or find steals at a statistically significant level ($\alpha = 0.05$).

## Metric 2: Outcome-Adjusted Value (OAV)

OAV measures realized value relative to positional expectations:

$$OAV_i = \frac{AV_i}{E[AV|round_i]} \cdot (1 + \frac{SDS_i}{100})$$

Where $E[AV|round]$ represents the expected career AV by round based on historical NFL averages:

| Round | $E[AV]$ | $\sigma_{AV}$ |
|-------|---------|---------------|
| 1 | 35 | 18.2 |
| 2 | 20 | 12.4 |
| 3 | 12 | 8.1 |
| 4 | 8 | 5.9 |
| 5 | 5 | 4.2 |
| 6 | 3 | 2.8 |
| 7 | 2 | 2.1 |

**OAV Interpretation:**
- $OAV > 1.5$: Exceptional value
- $1.0 \leq OAV \leq 1.5$: Met or exceeded expectations
- $0.5 \leq OAV < 1.0$: Underperformed
- $OAV < 0.5$: Significant underperformance

## Metric 3: Jimmy Johnson Trade Efficiency (JTE)

The JTE score measures trade value extracted per transaction:

$$JTE = \frac{\sum V_{received} - \sum V_{sent}}{n_{trades}}$$

Where $V$ represents Jimmy Johnson chart values. For the 49ers:

$$JTE = \frac{5165.1 - 5534.0}{3} = -122.97$$

This negative score indicates a net loss of ~123 draft value points per major trade.

## Probability Analysis

### Hit Rate Distribution

Let $X$ be the number of "hits" (Elite or Solid outcomes) in $n$ draft picks. Assuming independence, $X \sim Binomial(n, p)$.

**Observed:**
- Hits: $k = 17$ (6 Elite + 11 Solid)
- Total: $n = 58$
- Sample proportion: $\hat{p} = \frac{17}{58} = 0.293$

**Maximum Likelihood Estimate:**

$$\hat{p}_{MLE} = \frac{k}{n} = 0.293$$

**95% Wilson Score Confidence Interval:**

$$CI_{95\%} = \frac{\hat{p} + \frac{z^2}{2n} \pm z\sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}$$

With $z = 1.96$:

$$CI_{95\%} = [0.191, 0.418]$$

We can be 95% confident the 49ers' true hit rate lies between 19.1% and 41.8%.

### Hypothesis Test: Are the 49ers Better Than League Average?

**Null Hypothesis:** $H_0: p = 0.30$ (league average hit rate)
**Alternative:** $H_1: p \neq 0.30$

**Test Statistic:**

$$z = \frac{\hat{p} - p_0}{\sqrt{\frac{p_0(1-p_0)}{n}}} = \frac{0.293 - 0.30}{\sqrt{\frac{0.30 \cdot 0.70}{58}}} = -0.116$$

**P-value:** $P(|Z| > 0.116) = 0.908$

**Conclusion:** We fail to reject $H_0$. There is no statistically significant evidence that the 49ers draft better or worse than league average ($p = 0.908 >> 0.05$).

### Conditional Probability Analysis

Let's examine conditional hit rates:

**P(Hit | Round 1):**
$$P(Hit|R1) = \frac{3}{9} = 0.333$$

**P(Hit | Round 2):**
$$P(Hit|R2) = \frac{4}{8} = 0.500$$

**P(Hit | Round 5):**
$$P(Hit|R5) = \frac{5}{11} = 0.455$$

**P(Hit | Round 3):**
$$P(Hit|R3) = \frac{1}{7} = 0.143$$

### Chi-Square Test: Is Hit Rate Independent of Round?

| Round | Hits | Misses | Total |
|-------|------|--------|-------|
| 1 | 3 | 6 | 9 |
| 2 | 4 | 4 | 8 |
| 3 | 1 | 6 | 7 |
| 4 | 2 | 6 | 8 |
| 5 | 5 | 6 | 11 |
| 6 | 2 | 5 | 7 |
| 7 | 0 | 8 | 8 |

**Expected values under independence:** $E_{ij} = \frac{R_i \cdot C_j}{n}$

$$\chi^2 = \sum \frac{(O_{ij} - E_{ij})^2}{E_{ij}} = 6.84$$

**Degrees of freedom:** $df = (7-1)(2-1) = 6$

**Critical value:** $\chi^2_{0.05, 6} = 12.59$

**Conclusion:** $\chi^2 = 6.84 < 12.59$, so we fail to reject independence. However, the low p-value ($p \approx 0.34$) suggests a trend worth monitoring with more data.

## Regression Analysis

### Linear Model: Career AV vs. Draft Position

I fit a simple linear regression to examine if draft position predicts career value:

$$AV_i = \beta_0 + \beta_1 \cdot Pick_i + \epsilon_i$$

**Results:**

| Parameter | Estimate | Std. Error | t-value | p-value |
|-----------|----------|------------|---------|---------|
| $\beta_0$ (Intercept) | 22.4 | 4.2 | 5.33 | < 0.001 |
| $\beta_1$ (Pick) | -0.11 | 0.03 | -3.67 | < 0.001 |

**Model:** $\hat{AV} = 22.4 - 0.11 \cdot Pick$

**Interpretation:** For every 10 picks later in the draft, expected career AV decreases by 1.1 points. This is statistically significant ($p < 0.001$).

**Model Fit:**
- $R^2 = 0.194$ (draft position explains ~19% of variance in career AV)
- $R^2_{adj} = 0.180$
- RMSE = 14.8

The low $R^2$ indicates substantial unexplained variance - draft position alone is a weak predictor of NFL success, which aligns with the inherent uncertainty in player evaluation.

### Residual Analysis: Identifying Outliers

Players with standardized residuals $|r_i| > 2$:

| Player | Pick | Actual AV | Predicted AV | Residual | Std. Residual |
|--------|------|-----------|--------------|----------|---------------|
| George Kittle | 146 | 58 | 6.3 | +51.7 | +3.49 |
| Brock Purdy | 262 | 35 | -6.4 | +41.4 | +2.80 |
| Fred Warner | 70 | 52 | 14.7 | +37.3 | +2.52 |
| Nick Bosa | 2 | 49 | 22.2 | +26.8 | +1.81 |

Kittle and Purdy are extreme positive outliers - their production far exceeds what draft position would predict.

### Logistic Regression: Predicting Hit Probability

For binary classification (Hit = 1, Miss = 0):

$$\log\left(\frac{P(Hit)}{1-P(Hit)}\right) = \beta_0 + \beta_1 \cdot Pick + \beta_2 \cdot SDS$$

**Results:**

| Parameter | Estimate | Odds Ratio | 95% CI | p-value |
|-----------|----------|------------|--------|---------|
| Intercept | 0.42 | - | - | 0.31 |
| Pick | -0.008 | 0.992 | [0.984, 1.001] | 0.08 |
| SDS | 0.012 | 1.012 | [0.998, 1.027] | 0.11 |

**Interpretation:** Neither draft position nor SDS are statistically significant predictors of hit probability at $\alpha = 0.05$, though both show expected directional effects (earlier picks and steals slightly increase hit probability).

## 2026 Draft Capital

The 49ers enter the 2026 NFL Draft with the following selections:

| Round | Pick | JJ Value | E[AV] |
|-------|------|----------|-------|
| 1 | 27 | 680 | 13.2 |
| 2 | 58 | 310 | 8.4 |
| 3 | 92 | 140 | 5.8 |
| 4 | 127 | 54 | 3.9 |
| 4 | 133 | 46 | 3.6 |
| 4 | 138 | 40 | 3.4 |
| 5 | 171 | 21 | 2.8 |

**Total Draft Capital:**
- JJ Value: 1,291 points
- Combined E[AV]: 41.1

**Positional Needs:** EDGE, WR, OT, OG, S, OC

## Expected Value Analysis: 2026 Draft

Using the OAV framework, I calculate expected value for potential picks:

### Pick #27 Expected Value

$$E[Value|Pick = 27] = \sum_{outcome} P(outcome) \cdot Value(outcome)$$

Based on historical late round 1 distributions (picks 20-32):

| Outcome | P(Outcome) | AV Value | Weighted |
|---------|------------|----------|----------|
| Elite | 0.08 | 45 | 3.6 |
| Solid | 0.19 | 25 | 4.75 |
| Average | 0.21 | 15 | 3.15 |
| Below Avg | 0.24 | 8 | 1.92 |
| Bust | 0.28 | 3 | 0.84 |

$$E[AV|Pick = 27] = 14.26$$

### Trade Value Optimization

Using Jimmy Johnson values and Bayesian decision theory:

**Stay at #27:**
- Value: 680 points
- E[AV]: 14.26
- Certainty equivalent: 680

**Trade up to #15:**
- Cost: 680 + 310 (pick 58) = 990 points
- E[AV]: 16.8
- Net expected gain: +2.54 AV
- Cost: Lose 2nd round pick (E[AV] = 8.4)
- **Net E[AV]: -5.86** (unfavorable)

**Trade down to #35 + #70:**
- Receive: 500 + 235 = 735 points
- E[AV] at #35: 9.8
- E[AV] at #70: 6.2
- Total E[AV]: 16.0
- Net expected gain: +1.74 AV
- **Preserves all existing picks**

**Trade back into Round 1 (#30-32):**
- Cost: Pick 58 + Pick 92 = 450 points
- Acquire: ~32nd pick (590 points)
- E[AV] from two 1st rounders: 27.5
- **Best for premium positions (EDGE, OT)**

**Optimal Strategy:** With pick #27, the 49ers are already positioned in the value-efficient late 1st round range. The focus should be on maximizing positional value rather than trading for draft capital.

## Positional Strategy Analysis

Given the 49ers' positional needs (EDGE, WR, OT, OG, S, OC), I analyzed optimal draft allocation using positional value curves and historical hit rates.

### Positional Value by Round

$$PV_{pos,round} = E[AV|pos, round] \cdot \frac{1}{Salary_{pos}}$$

| Position | Rd 1 Hit% | Rd 2 Hit% | Rd 3 Hit% | Rd 4 Hit% | Optimal Round |
|----------|-----------|-----------|-----------|-----------|---------------|
| EDGE | 42% | 28% | 18% | 12% | **1st** |
| WR | 38% | 32% | 24% | 16% | **2nd-3rd** |
| OT | 45% | 25% | 14% | 8% | **1st** |
| OG | 35% | 30% | 22% | 18% | **2nd-3rd** |
| S | 32% | 28% | 22% | 20% | **2nd-4th** |
| OC | 28% | 26% | 24% | 20% | **3rd-4th** |

### Optimal Positional Allocation for 2026 Draft

Based on expected value maximization and positional scarcity:

**Round 1 (Pick 27) — Target: EDGE or OT**

$$E[AV|EDGE, Pick 27] = 0.42 \cdot 35 + 0.58 \cdot 8 = 19.34$$
$$E[AV|OT, Pick 27] = 0.45 \cdot 32 + 0.55 \cdot 7 = 18.25$$

- EDGE rushers have highest positional value in late 1st round
- OT available if elite EDGE talent is depleted
- Both positions command premium contracts — draft capital efficiency maximized

**Round 2 (Pick 58) — Target: WR or OG**

$$E[AV|WR, Pick 58] = 0.32 \cdot 25 + 0.68 \cdot 6 = 12.08$$
$$E[AV|OG, Pick 58] = 0.30 \cdot 20 + 0.70 \cdot 5 = 9.50$$

- WR depth typically strongest in rounds 2-3
- 49ers have historically found WR value (Deebo at 36)
- OG as fallback if premium WR unavailable

**Round 3 (Pick 92) — Target: S or WR**

$$E[AV|S, Pick 92] = 0.22 \cdot 18 + 0.78 \cdot 4 = 7.08$$
$$E[AV|WR, Pick 92] = 0.24 \cdot 20 + 0.76 \cdot 5 = 8.60$$

- Safety position shows consistent mid-round value
- Hufanga found at pick 180 demonstrates 49ers' safety evaluation skill
- BPA approach recommended

**Round 4 (Picks 127, 133, 138) — Target: OC, OG, S depth**

With three 4th-round selections:

$$E[\text{Combined AV}] = 3 \cdot E[AV|R4] = 3 \cdot 3.63 = 10.89$$

$$P(\text{At least one hit from 3 picks}) = 1 - (1 - 0.15)^3 = 0.386$$

- OC shows highest 4th-round hit rate among needs (20%)
- Interior OL depth provides roster flexibility
- Volume approach maximizes probability of finding contributor

**Round 5 (Pick 171) — Target: BPA (S, OG depth)**

- Developmental prospects only
- Special teams contributors
- 49ers' Kittle (146) and Purdy (262) prove late-round value exists

### Recommended Draft Board

| Pick | Position | Priority | Reasoning |
|------|----------|----------|-----------|
| 27 | EDGE | Primary | Highest E[AV], premium position |
| 27 | OT | Secondary | If EDGE depleted, similar value |
| 58 | WR | Primary | Peak value range for position |
| 58 | OG | Secondary | Scheme fit, proven need |
| 92 | S | Primary | Position of strength (Hufanga model) |
| 92 | WR | Secondary | Depth, if round 2 went OL |
| 127 | OC | Primary | Best R4 hit rate for needs |
| 133 | OG | Primary | Interior depth |
| 138 | S | Primary | Competition/depth |
| 171 | BPA | — | Developmental |

### Position-Specific Monte Carlo Results

Running 10,000 simulations for the recommended allocation:

| Scenario | Total E[AV] | P(≥2 Hits) | P(Elite) |
|----------|-------------|------------|----------|
| EDGE/WR/S/OC/OG/S/BPA | 44.8 | 48.2% | 12.1% |
| OT/OG/WR/OC/S/OG/BPA | 41.2 | 44.7% | 10.8% |
| EDGE/OG/S/OC/OC/S/BPA | 42.1 | 46.3% | 11.4% |

**Optimal allocation: EDGE (27) → WR (58) → S (92) → OC/OG/S (127-138) → BPA (171)**

## Monte Carlo Simulation: Draft Strategy Outcomes

To validate strategy with pick #27, I ran a Monte Carlo simulation with 10,000 iterations:

### Simulation Parameters

```python
def simulate_draft_outcome(pick_position, n_simulations=10000):
    outcomes = []
    for _ in range(n_simulations):
        # Sample from historical outcome distribution
        outcome = np.random.choice(
            ['Elite', 'Solid', 'Average', 'Below_Avg', 'Bust'],
            p=get_probability_by_pick(pick_position)
        )
        av = sample_av_given_outcome(outcome)
        outcomes.append(av)
    return outcomes
```

### Results

| Strategy | Mean AV | Std Dev | P(Elite) | 95% CI |
|----------|---------|---------|----------|--------|
| Stay #27 | 14.3 | 12.8 | 8.0% | [13.1, 15.5] |
| Trade up #15 | 16.8 | 14.1 | 11.2% | [15.4, 18.2] |
| Trade down #35 + #70 | 16.0 | 10.2 | 14.3%* | [14.8, 17.2] |
| Use all 7 picks optimally | 44.8 | 18.4 | 31.2%** | [42.1, 47.5] |

*Combined probability of at least one Elite player from two picks.
**Probability of at least one Elite player across all 7 selections.

### Value at Risk (VaR) Analysis

Using the 5th percentile as a risk measure:

$$VaR_{0.05} = \text{5th percentile of simulated AV distribution}$$

| Strategy | VaR (5%) | Expected Shortfall |
|----------|----------|-------------------|
| Stay #27 | 0 | -1.8 |
| Trade up #15 | 0 | -2.9 |
| Trade down #35 + #70 | 2 | +0.4 |
| Full draft (7 picks) | 12 | +4.2 |

The multi-pick approach provides strong downside protection. With 7 selections, even worst-case scenarios yield meaningful roster contributions.

## Bayesian Analysis: Updating Beliefs

### Prior Distribution on Hit Rate

Before observing data, assume a Beta prior on the hit rate:

$$p \sim Beta(\alpha_0, \beta_0) = Beta(3, 7)$$

This reflects a prior belief of ~30% hit rate with moderate uncertainty.

### Posterior Distribution

After observing 17 hits in 58 picks:

$$p | data \sim Beta(\alpha_0 + k, \beta_0 + n - k) = Beta(20, 48)$$

**Posterior Mean:**
$$E[p|data] = \frac{20}{68} = 0.294$$

**Posterior 95% Credible Interval:**
$$[0.193, 0.409]$$

The Bayesian analysis confirms our frequentist findings - the 49ers' hit rate is consistent with league average.

### Posterior Predictive: 2026 Draft

What's the probability the 49ers hit on their first-round pick in 2026?

$$P(\text{Hit in 2026}) = \int_0^1 p \cdot f(p|data) dp = E[p|data] = 0.294$$

There's approximately a **29.4% chance** the 49ers find an Elite or Solid player with the #27 pick.

**Full Draft Hit Probability:**

With 7 picks (assuming independence):

$$P(\text{At least one hit}) = 1 - (1 - 0.294)^7 = 0.918$$

There's a **91.8% probability** the 49ers find at least one Elite or Solid player across their seven 2026 selections.

## Correlation Analysis

### Correlation Matrix

| | Pick | SDS | AV | Pro Bowls |
|--|------|-----|-----|-----------|
| Pick | 1.00 | 0.72 | -0.44 | -0.38 |
| SDS | 0.72 | 1.00 | -0.21 | -0.15 |
| AV | -0.44 | -0.21 | 1.00 | 0.89 |
| Pro Bowls | -0.38 | -0.15 | 0.89 | 1.00 |

**Key findings:**
- Strong negative correlation between pick position and career AV ($r = -0.44$)
- Very strong correlation between AV and Pro Bowls ($r = 0.89$)
- Weak correlation between SDS and outcomes - being a "steal" doesn't strongly predict success

## Summary Statistics

### Descriptive Statistics by Outcome

| Status | n | Mean AV | SD AV | Mean Pick | Mean SDS |
|--------|---|---------|-------|-----------|----------|
| Elite | 6 | 44.5 | 13.2 | 110.2 | -10.3 |
| Solid | 11 | 17.4 | 5.8 | 126.5 | -2.1 |
| Average | 6 | 8.2 | 3.1 | 98.3 | 1.4 |
| Below Avg | 9 | 4.1 | 2.3 | 154.2 | -5.8 |
| Bust | 16 | 1.8 | 1.9 | 142.1 | -1.2 |
| TBD | 10 | 3.4 | 1.8 | 168.4 | -12.3 |

### ANOVA: Does Outcome Depend on Draft Round?

$$H_0: \mu_{AV,R1} = \mu_{AV,R2} = ... = \mu_{AV,R7}$$

**F-statistic:** $F = 3.42$
**P-value:** $p = 0.006$

We reject $H_0$ at $\alpha = 0.05$. Career AV significantly differs across rounds (as expected).

**Post-hoc Tukey HSD:**
- Round 1 vs Round 7: $p < 0.01$ (significant)
- Round 2 vs Round 7: $p < 0.05$ (significant)
- Round 1 vs Round 2: $p = 0.42$ (not significant)

## The Elite Six

From a statistical perspective, these six players represent extreme positive outliers:

| Player | Pick | AV | Z-Score | Percentile |
|--------|------|-----|---------|------------|
| George Kittle | 146 | 58 | +3.49 | 99.98% |
| Fred Warner | 70 | 52 | +2.52 | 99.41% |
| Nick Bosa | 2 | 49 | +1.81 | 96.48% |
| Deebo Samuel | 36 | 38 | +1.45 | 92.65% |
| Brock Purdy | 262 | 35 | +2.80 | 99.74% |
| Talanoa Hufanga | 180 | 22 | +1.12 | 86.86% |

Kittle and Purdy are both beyond 3 standard deviations from expected - true black swan events.

## Conclusions

### Statistical Findings

1. **Hit rate is league average:** $\hat{p} = 0.293$, 95% CI [0.191, 0.418], not significantly different from 0.30

2. **Reaching doesn't predict failure:** Mean SDS for Elite players is -10.3 (reaches), suggesting the 49ers' board may be more accurate than consensus

3. **Round matters, but less than expected:** Draft round explains only ~19% of variance in career AV ($R^2 = 0.194$)

4. **Volume maximizes expected value:** Monte Carlo simulation shows E[AV] = 44.8 for optimal 7-pick allocation

5. **Variance is the enemy:** Multiple picks provide downside protection (VaR = 12 for full draft vs 0 for single pick)

### Recommendations for 2026

Based on the statistical analysis and current draft capital:

$$\text{Optimal Decision} = \arg\max_{strategy} \left[ E[AV] - \lambda \cdot Var[AV] \right]$$

**2026 Draft Capital Summary:**
| Round | Pick(s) | Total JJ Value |
|-------|---------|----------------|
| 1 | 27 | 680 |
| 2 | 58 | 310 |
| 3 | 92 | 140 |
| 4 | 127, 133, 138 | 140 |
| 5 | 171 | 21 |
| **Total** | **7 picks** | **1,291** |

**Optimal Positional Strategy:**

| Pick | Target Position | E[AV] | Reasoning |
|------|-----------------|-------|-----------|
| 27 | EDGE | 19.3 | Premium position, highest late R1 value |
| 58 | WR | 12.1 | Peak positional value range |
| 92 | S | 7.1 | Builds on Hufanga-type evaluation strength |
| 127 | OC | 3.9 | Highest R4 hit rate for need positions |
| 133 | OG | 3.6 | Interior OL depth |
| 138 | S | 3.4 | Competition and special teams |
| 171 | BPA | 2.8 | Developmental/upside |

**Key Strategic Insights:**

1. **Stay at #27:** Already in value-efficient range. Trading up sacrifices more E[AV] than gained.

2. **Maximize pick volume:** Three 4th-rounders provide 38.6% probability of finding at least one contributor.

3. **Target premium positions early:** EDGE (27) and WR (58) offer highest positional value at those slots.

4. **Use Day 3 for depth:** OC, OG, and S positions show viable mid-round hit rates.

5. **91.8% hit probability:** Across all 7 selections, near-certainty of finding at least one starter-quality player.

---
*Updated 01/19/2026: *
*Analysis conducted using Python with pandas, numpy, scipy, and matplotlib. Statistical methods include frequentist hypothesis testing, Bayesian inference, linear and logistic regression, Monte Carlo simulation and ANOVA. Data sources: Pro Football Reference and Jimmy Johnson Trade Value Chart.*


