---
title: "IMDb Sentiment Analysis"
date: 2026-01-09
ShowPostNavLinks: true
showHero: true
description: "This notebook performs comprehensive sentiment alalysis on IMDb reviews using pre-trained BERT models."
tags: ["IMDb Sentiment", "Binary Sentiment Classification", "Detailed Insights", "Advanced Text Preprocessing", "Rich Visualizations", "Data Export", "Dataset", "Model", ]
sitemap:
  priority: 0.8
  changefreq: monthly
---
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
This project uses the <a href="https://huggingface.co/datasets/imdb" target="_blank">IMDb dataset</a> from HuggingFace, containing:   
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
#### 3. Install dependencies
    pip install -r requirements.txt
#### 4. Download spacy language model
    python -m spacy download en_core_web_sm
#### 5. Launch Jupyter Notebook
    jupyter notebook
#### 6. Open imdb_sentiment_analysis.ipynb and run all cells


## Usage
#### Quick Start
1. Open the imdb_sentiment_analysis.ipynb notebook
2. Run all cells sequentially (Cell > Run All)
3. The notebook will:
- Download the IMDb dataset automatically
- Load the pre-trained model
- Perform sentiment analysis
- Generate visualizations
- Export results to outputs/ directory

#### Configuration: 
    You can adjust settings in Cell 3 of the notebook:
        CONFIG = {
            'model_name': 'distilbert-base-uncased-finetuned-sst-2-english',
            'max_samples': 1000,  # Set to None for full dataset (50k reviews)
            'batch_size': 16,     # Adjust based on your RAM
            'max_length': 512     # Maximum token length for BERT
        }
    Tip: Start with max_samples=1000 for quick testing, then set to None for full analysis.

## Output Files
After running the notebook, you'll find:
#### In outputs/ directory:
- predictions.csv: All predictions with metadata
Columns: review_text, true_label, predicted_label, confidence_score, true_sentiment, predicted_sentiment, correct_prediction
- insights.json: Comprehensive insights summary
Dataset statistics
Model performance metrics
Top positive/negative keywords
Aspect-based analysis results
Review length statistics

#### In outputs/visualizations/ directory:
    review_length_analysis.png: Review length distributions
    confusion_matrix.png: Model performance visualization
    confidence_analysis.png: Confidence score distributions
    sentiment_distribution.png: Overall sentiment breakdown
    keyword_comparison.png: Top keywords in positive vs negative reviews
    wordcloud_positive.png: Word cloud of positive reviews
    wordcloud_negative.png: Word cloud of negative reviews
    aspect_analysis.png: Sentiment by movie aspects
    person_sentiment.png: Sentiment for mentioned actors/directors
    length_analysis.png: Review length vs sentiment correlation

## Project Structure:
    imdb-sentiment-analysis/
    ├── imdb_sentiment_analysis.ipynb    # Main implementation notebook
    ├── requirements.txt                  # Python dependencies
    ├── README.md                         # This file
    ├── .gitignore                        # Git ignore rules
    ├── outputs/                          # Generated results (created  after first run)
    │   ├── predictions.csv
    │   ├── insights.json
    │   └── visualizations/
    │       └── [10+ PNG files]
    └── data/                             # Dataset cache (auto-downloaded)    

## Key Insights Generated
The notebook extracts several types of insights
#### 1. Keyword Analysis
Top 30 keywords from positive reviews (e.g., "great", "excellent", "amazing")
Top 30 keywords from negative reviews (e.g., "bad", "terrible", "boring")
TF-IDF scoring to identify most distinctive words
#### 2. Aspect-Based Sentiment
Analyzes sentiment for 8 movie aspects:
Acting/Performance
Plot/Story
Cinematography
Direction
Music/Soundtrack
Pacing
Dialogue
Special Effects
#### 3. Named Entity Recognition
Identifies actors, directors, and other persons mentioned
Analyzes sentiment context of mentions
Shows which actors are associated with positive vs negative reviews
#### 4. Statistical Analysis
Review length correlations with sentiment
Confidence score distributions
Prediction accuracy by confidence level

## Understanding the Results
#### Sentiment Labels
0 / Negative: The review expresses negative sentiment
1 / Positive: The review expresses positive sentiment
#### Confidence Scores
Range: 0.5 to 1.0
0.5-0.7: Low confidence (uncertain prediction)
0.7-0.9: Medium confidence (reasonably certain)
0.9-1.0: High confidence (very certain)
#### Expected Performance 
Accuracy: 85-90% on test set
Processing Time:
1,000 samples: ~2-3 minutes (CPU)
25,000 samples: ~30-40 minutes (CPU)
With GPU: 5-10x faster

## Troubleshooting
#### Issue: Out of Memory Error
##### Solution:
    Reduce max_samples in CONFIG (try 500 or 1000)
    Lower batch_size to 8 or 4
    Close other applications
#### Issue: spaCy model not found
##### Solution:
    python -m spacy download en_core_web_sm
#### Issue: Slow processing
##### Solution:
    Reduce max_samples for testing
    Use max_length=256 instead of 512
    Consider using GPU if available
#### Issue: Module not found
##### Solution 
    pip install -r requirements.txt --upgrade
#### Issue: CUDA out of memory (if using GPU)
##### Solution: 
    # In Cell 3, force CPU usage:
    CONFIG = {
        ...
        'device': 'cpu',  # Force CPU
    }
## Advanced: Fine-Tuning (Optional)    
The notebook includes an optional section (Cells 30-34) demonstrating how to fine-tune DistilBERT on the IMDb dataset:
- Expected accuracy improvement: 92-95%
- Requires GPU for reasonable training time
- Training time: ~30-60 minutes on GPU, several hours on CPU
- Good for learning about model training
Note: Fine-tuning is optional and not required for good results.

## Technical Details
#### Text Preprocessing Pipeline
##### 1. Basic Preprocessing (for BERT input):
- HTML tag removal
- Whitespace normalization
- Special character handling
##### 2. Advanced Preprocessing (for insights):
- Custom stopword removal (preserves "not", "no", "very", etc.)
- Lemmatization with spaCy
- Token filtering
#### Model Architecture
- Base: DistilBERT (66M parameters)
- Distilled from BERT-base (110M parameters)
- 40% smaller, 60% faster, 97% of BERT's performance
- Pre-trained on sentiment classification task

## Learning Objectives
This project demonstrates:
- Using pre-trained transformer models (BERT family)
- Text preprocessing for NLP tasks
- Sentiment analysis techniques
- TF-IDF keyword extraction
- Aspect-based sentiment analysis
- Named entity recognition
- Data visualization for ML results
- Proper ML project structure

## Dependencies
- transformers: HuggingFace library for BERT models
- datasets: HuggingFace datasets library
- torch: PyTorch for deep learning
- spacy: Industrial-strength NLP
- scikit-learn: Machine learning utilities
- matplotlib/seaborn: Visualization
- wordcloud: Word cloud generation
- pandas/numpy: Data manipulation

## Future Enhancements
Potential improvements:
- Multi-class sentiment (5-star ratings)
- Topic modeling with LDA or BERTopic
- Temporal sentiment analysis
- Comparative analysis (multiple models)
- Interactive web dashboard with Streamlit
- Real-time review analysis API

## License
This project is for educational purposes. The IMDb dataset is subject to HuggingFace's terms of use.

## Acknowledgments
- IMDb dataset from <a href="https://huggingface.co/imdb/datasets" target="_blank">HuggingFace</a>
- DistilBERT model from <a href="https://huggingface.co/distilbert/distilbert-base-uncased-finetuned-sst-2-english" target="_blank">HuggingFace Transformers</a>
- spaCy NLP library

## Support
If you encounter issues:
Check the Troubleshooting section above
Ensure all dependencies are installed correctly
Try with a smaller dataset first (max_samples=1000)
Verify Python version (3.8+)

## Citation
If you use this project for research or educational purposes, please cite:
IMDb Dataset: Maas et al. (2011)
DistilBERT: Sanh et al. (2019)