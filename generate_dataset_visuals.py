import matplotlib.pyplot as plt
import numpy as np
import os

# Create output directory for figures
output_dir = 'paper_figures_output'
os.makedirs(output_dir, exist_ok=True)

# Set global matplotlib styles
plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.sans-serif': ['Arial', 'Helvetica', 'DejaVu Sans', 'Calibri', 'sans-serif'],
    'text.color': '#2C3E50',
    'axes.labelcolor': '#2C3E50',
    'xtick.color': '#2C3E50',
    'ytick.color': '#2C3E50'
})

# Curated premium color palette matching the user's photo
COLOR_SYNTHETIC = '#183D30'   # Deep Forest Green
COLOR_REAL_USED = '#80C2A5'   # Soft Mint Green
COLOR_GOLD = '#D9982E'        # Premium Gold/Orange

def create_slide_canvas(title):
    """Creates a blank widescreen slide canvas (19.2x10.8 inches for 1920x1080 px, 16:9)."""
    fig = plt.figure(figsize=(19.2, 10.8), facecolor='#F5F6F8')
    
    # Draw slide title
    fig.text(0.5, 0.92, title, fontsize=36, fontweight='bold', ha='center', color='#183D30')
    
    # Draw top border accent line
    fig.patch.set_linewidth(0)
    
    # Return figure
    return fig

def add_pie_chart(fig, rect, title, labels, sizes, colors):
    """Adds a styled pie chart at the specified rect (left, bottom, width, height)."""
    ax = fig.add_axes(rect)
    ax.set_facecolor('none')
    
    # Plot pie chart with clean white borders and matching colors
    wedges, texts, autotexts = ax.pie(
        sizes, 
        labels=labels, 
        autopct=lambda p: '{:,.0f}\n({:.1f}%)'.format(round(p * sum(sizes) / 100), p),
        colors=colors,
        startangle=90,
        counterclock=False,
        textprops={'fontsize': 11, 'color': '#2C3E50'},
        wedgeprops={'linewidth': 2.5, 'edgecolor': '#F5F6F8'},
        pctdistance=0.65
    )
    
    # Style labels and autopct texts
    for t in texts:
        t.set_fontsize(12)
        t.set_weight('bold')
    for at in autotexts:
        at.set_fontsize(10)
        at.set_color('white')
        at.set_weight('bold')
        # If the slice is small, move the percentage label out or change color
        if at.get_text().startswith('1') or at.get_text().startswith('2') or at.get_text().startswith('400') or at.get_text().startswith('500'):
            at.set_color('white')
            
    ax.set_title(title, fontsize=20, fontweight='bold', pad=15, color='#183D30')
    return ax

def add_slide_content(fig, sections, start_y=0.78, line_spacing=0.038):
    """Draws bulleted text sections on the right side of the slide."""
    y = start_y
    for section_title, bullets in sections.items():
        # Draw section header
        fig.text(0.42, y, section_title, fontsize=22, fontweight='bold', color='#183D30')
        y -= 0.035
        
        # Draw bullets
        for bullet in bullets:
            # Simple text wrap
            words = bullet.split(' ')
            lines = []
            current_line = "• "
            for word in words:
                test_line = current_line + " " + word if len(current_line) > 2 else "• " + word
                if len(test_line) > 65:
                    lines.append(current_line)
                    current_line = "  " + word
                else:
                    current_line = test_line
            lines.append(current_line)
            
            for line in lines:
                fig.text(0.42, y, line, fontsize=15, color='#2C3E50')
                y -= 0.028
        
        y -= 0.025  # Space between sections

def generate_face_dataset_diagram():
    """Generates the diagram/slide for the Facial Emotion Dataset."""
    fig = create_slide_canvas("Facial Emotion Dataset")
    
    # Train Data Split
    # Augmented Faces: 25,000
    # Real Used: 15,000
    # Real Unused: 2,500
    train_labels = ['Augmented Faces', 'Real Used', 'Real Unused']
    train_sizes = [25000, 15000, 2500]
    train_colors = [COLOR_SYNTHETIC, COLOR_REAL_USED, COLOR_GOLD]
    
    # Evaluation Data Split
    # Robustness Test Set: 3,000
    # Held-out Real Test Set: 7,178
    test_labels = ['Robustness Test Set', 'Held-out Real Test Set']
    test_sizes = [3000, 7178]
    test_colors = [COLOR_SYNTHETIC, COLOR_GOLD]
    
    # Add pie charts on the left
    add_pie_chart(fig, [0.08, 0.50, 0.30, 0.32], "Train Data", train_labels, train_sizes, train_colors)
    add_pie_chart(fig, [0.08, 0.12, 0.30, 0.32], "Evaluation Data", test_labels, test_sizes, test_colors)
    
    # Slide Content text on the right
    sections = {
        "Nature of Data": [
            "Standardized facial crop images from FER-2013 & custom captures.",
            "Format: Grayscale PNG frames.",
            "Resolution: 48 × 48 pixels (optimized for light-weight networks).",
            "Classes: 7 emotions (Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise).",
            "Distribution: Approximately balanced across classes using augmentations."
        ],
        "Key Challenges": [
            "Severe class imbalance (e.g., Disgust has very few training samples).",
            "High similarity between classes (e.g., Fear vs. Surprise, Sad vs. Neutral).",
            "Varying environmental factors (lighting, camera angles, user head tilt)."
        ],
        "Preprocessing Pipeline": [
            "Real-time face detection using Haar Cascade to isolate face regions.",
            "Image normalization: Scaling pixel values to [0, 1] range.",
            "Augmentation: Rotation, width/height shifts, zoom, and horizontal flips.",
            "Evaluation Protocol: Standard testing on Held-out Real Test Set; robustness analysis on transformed images under Robustness Test Set."
        ]
    }
    
    add_slide_content(fig, sections, start_y=0.78)
    
    # Add a professional bottom banner matching the photo style
    fig.text(0.5, 0.04, "IEEE Conference Presentation  |  MindMatters Facial Emotion Module", 
             fontsize=12, color='#7F8C8D', ha='center', style='italic')
    
    # Save the slide
    output_path = os.path.join(output_dir, 'Slide_Face_Dataset.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated Face Dataset slide at: {output_path}")

def generate_voice_dataset_diagram():
    """Generates the diagram/slide for the Voice Emotion Dataset."""
    fig = create_slide_canvas("Voice Emotion Dataset")
    
    # Train Data Split
    # Augmented Audio: 4,000
    # Real Used: 2,000
    # Real Unused: 400
    train_labels = ['Augmented Audio', 'Real Used', 'Real Unused']
    train_sizes = [4000, 2000, 400]
    train_colors = [COLOR_SYNTHETIC, COLOR_REAL_USED, COLOR_GOLD]
    
    # Evaluation Data Split
    # Robustness Test Set: 500
    # Held-out Real Test Set: 1,200
    test_labels = ['Robustness Test Set', 'Held-out Real Test Set']
    test_sizes = [500, 1200]
    test_colors = [COLOR_SYNTHETIC, COLOR_GOLD]
    
    # Add pie charts on the left
    add_pie_chart(fig, [0.08, 0.50, 0.30, 0.32], "Train Data", train_labels, train_sizes, train_colors)
    add_pie_chart(fig, [0.08, 0.12, 0.30, 0.32], "Evaluation Data", test_labels, test_sizes, test_colors)
    
    # Slide Content text on the right
    sections = {
        "Nature of Data": [
            "Bilingual voice samples (English & Hindi) expressing emotional states.",
            "Format: 16 kHz WAV audio files (3 to 5 second conversational clips).",
            "Sources: RAVDESS + CREMA-D + Custom Hindi/Kashmiri recordings.",
            "Classes: 6 emotions (Stress, Neutral, Sadness, Fatigue, Joy, Anger).",
            "Distribution: Approximately balanced across six emotion classes."
        ],
        "Key Challenges": [
            "Heavy environmental background noise in user-submitted recordings.",
            "Varied speech rates, volume modulations, and regional Indian accents.",
            "Acoustic overlap between emotional states (e.g., Anger and Stress)."
        ],
        "Preprocessing & Feature Extraction": [
            "Speech transcribed using Whisper for linguistic feature extraction.",
            "Audio normalization, silence trimming, and noise suppression.",
            "Augmentation: Pitch Shift, Time Stretch, Gaussian Noise, Volume Perturbation.",
            "Feature extraction: 13 MFCCs + Log-Mel Spectrogram + Pitch + RMS Energy.",
            "Evaluation Protocol: Out-of-sample testing on Held-out Real Test Set; robustness analysis on perturbed files under Robustness Test Set."
        ]
    }
    
    add_slide_content(fig, sections, start_y=0.78)
    
    # Add a professional bottom banner matching the photo style
    fig.text(0.5, 0.04, "IEEE Conference Presentation  |  MindMatters Voice Emotion Module", 
             fontsize=12, color='#7F8C8D', ha='center', style='italic')
    
    # Save the slide
    output_path = os.path.join(output_dir, 'Slide_Voice_Dataset.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated Voice Dataset slide at: {output_path}")

def generate_individual_charts():
    """Generates individual pie charts with transparent backgrounds for direct PPT insertion."""
    # Helper to clean labels for standalone charts
    autopct_fn = lambda sizes: (lambda p: '{:,.0f}\n({:.1f}%)'.format(round(p * sum(sizes) / 100), p))

    # Face Train Pie
    fig, ax = plt.subplots(figsize=(6, 6), facecolor='none')
    ax.set_facecolor('none')
    labels = ['Augmented Faces', 'Real Used', 'Real Unused']
    sizes = [25000, 15000, 2500]
    ax.pie(sizes, labels=labels, autopct=autopct_fn(sizes), colors=[COLOR_SYNTHETIC, COLOR_REAL_USED, COLOR_GOLD],
           startangle=90, counterclock=False, textprops={'fontsize': 12, 'weight': 'bold', 'color': '#2C3E50'},
           wedgeprops={'linewidth': 2, 'edgecolor': '#F5F6F8'}, pctdistance=0.6)
    plt.title("Face Train Data Split", fontsize=16, fontweight='bold', color='#183D30', pad=15)
    plt.savefig(os.path.join(output_dir, 'Chart_Face_Train_Pie.png'), dpi=300, bbox_inches='tight', transparent=True)
    plt.close()

    # Face Test/Evaluation Pie
    fig, ax = plt.subplots(figsize=(6, 6), facecolor='none')
    ax.set_facecolor('none')
    labels = ['Robustness Test Set', 'Held-out Real Test Set']
    sizes = [3000, 7178]
    ax.pie(sizes, labels=labels, autopct=autopct_fn(sizes), colors=[COLOR_SYNTHETIC, COLOR_GOLD],
           startangle=90, counterclock=False, textprops={'fontsize': 12, 'weight': 'bold', 'color': '#2C3E50'},
           wedgeprops={'linewidth': 2, 'edgecolor': '#F5F6F8'}, pctdistance=0.6)
    plt.title("Face Evaluation Data", fontsize=16, fontweight='bold', color='#183D30', pad=15)
    plt.savefig(os.path.join(output_dir, 'Chart_Face_Test_Pie.png'), dpi=300, bbox_inches='tight', transparent=True)
    plt.close()

    # Voice Train Pie
    fig, ax = plt.subplots(figsize=(6, 6), facecolor='none')
    ax.set_facecolor('none')
    labels = ['Augmented Audio', 'Real Used', 'Real Unused']
    sizes = [4000, 2000, 400]
    ax.pie(sizes, labels=labels, autopct=autopct_fn(sizes), colors=[COLOR_SYNTHETIC, COLOR_REAL_USED, COLOR_GOLD],
           startangle=90, counterclock=False, textprops={'fontsize': 12, 'weight': 'bold', 'color': '#2C3E50'},
           wedgeprops={'linewidth': 2, 'edgecolor': '#F5F6F8'}, pctdistance=0.6)
    plt.title("Voice Train Data Split", fontsize=16, fontweight='bold', color='#183D30', pad=15)
    plt.savefig(os.path.join(output_dir, 'Chart_Voice_Train_Pie.png'), dpi=300, bbox_inches='tight', transparent=True)
    plt.close()

    # Voice Test/Evaluation Pie
    fig, ax = plt.subplots(figsize=(6, 6), facecolor='none')
    ax.set_facecolor('none')
    labels = ['Robustness Test Set', 'Held-out Real Test Set']
    sizes = [500, 1200]
    ax.pie(sizes, labels=labels, autopct=autopct_fn(sizes), colors=[COLOR_SYNTHETIC, COLOR_GOLD],
           startangle=90, counterclock=False, textprops={'fontsize': 12, 'weight': 'bold', 'color': '#2C3E50'},
           wedgeprops={'linewidth': 2, 'edgecolor': '#F5F6F8'}, pctdistance=0.6)
    plt.title("Voice Evaluation Data", fontsize=16, fontweight='bold', color='#183D30', pad=15)
    plt.savefig(os.path.join(output_dir, 'Chart_Voice_Test_Pie.png'), dpi=300, bbox_inches='tight', transparent=True)
    plt.close()
    
    print("Generated all individual charts with transparent background.")

if __name__ == '__main__':
    print("Generating dataset slides and charts...")
    generate_face_dataset_diagram()
    generate_voice_dataset_diagram()
    generate_individual_charts()
    print("Done!")
