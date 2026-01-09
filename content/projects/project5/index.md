---
title: "IMDb Sentiment Analysis"
date: 2026-01-09
ShowPostNavLinks: true
showHero: true
description: "IMDb Sentiment Analysis"
tags: ["IMDb Sentiment", "Binary Sentiment Classification", "Detailed Insights", "Advanced Text Preprocessing", "Rich Visualizations", "Data Export", "Dataset", "Model", ]
sitemap:
  priority: 0.8
  changefreq: monthly
---
# IMDb Sentiment Analysis
A comprehensive machine learning project that performs sentiment analysis on IMDb movie reviews using pre-trained BERT models. This beginner-friendly project demonstrates data science and machine learning applications in the entertainment industry.

## Features
Binary Sentiment Classification: Classifies reviews as positive or negative with confidence scores
Detailed Insights Extraction: Discovers what viewers liked/disliked about movies
    TF-IDF keyword extraction
    Aspect-based sentiment analysis (acting, plot, cinematography, music, etc.)
    Named entity recognition for actors and directors
Advanced Text Preprocessing: Uses spaCy for stopword removal while preserving sentiment-bearing words
Rich Visualizations: 10+ charts including word clouds, keyword comparisons and aspect analysis
Data Export: Save predictions to CSV and insights to JSON

## Dataset
This project uses the<a href="https://huggingface.co/datasets/imdb" target="_blank">IMDb dataset</a> from HuggingFace, containing:   
    50,000 movie reviews (25,000 train, 25,000 test)
    Binary sentiment labels (positive/negative)
    Pre-split and ready to use

## Model
Uses distilbert-base-uncased-finetuned-sst-2-english - a pre-trained DistilBERT model fine-tuned for sentiment analysis:
    Expected Accuracy: 85-90%
    No GPU Required: Works on CPU (though GPU speeds it up)
    No Training Needed: Ready to use out of the box

## Installation
Prerequisites:
    Python 3.8 or higher
    pip package manager

## Setup Steps
#### 1. Clone or download this project:
    cd imdb-sentiment-analysis
#### 2. Create a virtual environment (recommended)
    python -m venv venv
    source venv/bin/activate # On Windows: venv\Scripts\activate
#### Install dependencies
    pip install -r requirements.txt
    
