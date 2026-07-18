import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

# Create output directory for figures
output_dir = 'paper_figures_output'
os.makedirs(output_dir, exist_ok=True)

# Curated premium colors
COLOR_FOREST = '#183D30'   # Forest Green (Processing)
COLOR_MINT = '#80C2A5'     # Mint Green (Input / Start)
COLOR_GOLD = '#D9982E'     # Gold (LLM Core)
COLOR_TEAL = '#2A9D8F'     # Teal (Output / Actions)
COLOR_DARK_TEXT = '#2C3E50'
COLOR_LINE = '#7F8C8D'

# Pipeline steps text and their respective category color
STEPS = [
    {"text": "User Emotion\n(Webcam + Mic Input)", "color": COLOR_MINT},
    {"text": "Multimodal Fusion\n(Face + Voice)", "color": COLOR_FOREST},
    {"text": "Emotion Context\n(Temporal Tracking)", "color": COLOR_FOREST},
    {"text": "Llama 3.1 8B\n(4-bit Quantized)", "color": COLOR_GOLD},
    {"text": "Safety Guardrails\n(Policy Filtering)", "color": COLOR_FOREST},
    {"text": "Empathetic Response\n(Bilingual Text/Speech)", "color": COLOR_TEAL},
    {"text": "Mood Log & Alerts\n(Mental Health Portal)", "color": COLOR_TEAL}
]

def generate_vertical_paper_diagram():
    """Generates a vertical flowchart suited for single column in an IEEE paper."""
    fig, ax = plt.subplots(figsize=(6.5, 9.5), facecolor='white')
    ax.set_facecolor('white')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    
    # Hide axis
    ax.axis('off')
    
    # Title
    ax.text(50, 98, "Fig. 2. Chatbot Response Generation Pipeline", 
            fontsize=14, fontweight='bold', ha='center', va='top', color=COLOR_FOREST)
    
    # Draw blocks
    # Y-coordinates for 7 blocks
    y_coords = np.linspace(90, 8, 7)
    box_height = 8
    
    for i, step in enumerate(STEPS):
        y = y_coords[i]
        
        # Draw box
        # We can draw it using ax.text with a styled bbox
        # To make it stand out, we use white text on colored background for forest/teal, and dark text on mint/gold
        text_color = 'white' if step['color'] in [COLOR_FOREST, COLOR_TEAL] else '#1A252C'
        
        ax.text(50, y, f"Step {i+1}: {step['text']}", 
                ha='center', va='center', fontsize=11, fontweight='bold', color=text_color,
                bbox=dict(boxstyle="round,pad=0.6,rounding_size=0.2", 
                          facecolor=step['color'], 
                          edgecolor='#2C3E50', 
                          linewidth=1.2))
        
        # Draw arrow to next block
        if i < len(STEPS) - 1:
            arrow_start_y = y - 4.5
            arrow_end_y = y_coords[i+1] + 4.5
            ax.annotate("", 
                        xy=(50, arrow_end_y), 
                        xytext=(50, arrow_start_y),
                        arrowprops=dict(arrowstyle="-|>", 
                                        color=COLOR_FOREST, 
                                        lw=2.0, 
                                        mutation_scale=12))
            
    plt.tight_layout()
    output_path = os.path.join(output_dir, 'Fig2_Chatbot_Pipeline.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated paper flowchart at: {output_path}")

def generate_horizontal_slide_diagram():
    """Generates a horizontal widescreen (16:9) diagram suited for PPT slides."""
    fig = plt.figure(figsize=(19.2, 10.8), facecolor='#F5F6F8')
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_facecolor('#F5F6F8')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Slide Title
    fig.text(0.5, 0.90, "Chatbot Response Generation Pipeline", 
             fontsize=36, fontweight='bold', ha='center', color=COLOR_FOREST)
    
    # Subtitle or explanation
    fig.text(0.5, 0.83, 
             "A step-by-step pipeline illustrating how user emotions are captured, processed, and responded to empathetically.",
             fontsize=16, ha='center', color=COLOR_DARK_TEXT, style='italic')
    
    # X coordinates for 7 horizontal blocks
    x_coords = np.linspace(8, 92, 7)
    y = 52
    
    for i, step in enumerate(STEPS):
        x = x_coords[i]
        
        # Set text color based on background luminance
        text_color = 'white' if step['color'] in [COLOR_FOREST, COLOR_TEAL] else '#1A252C'
        
        # Display index circle
        ax.text(x, y + 10, f"0{i+1}", fontsize=18, fontweight='bold', color=step['color'], ha='center')
        
        # Display Box
        ax.text(x, y, step['text'], 
                ha='center', va='center', fontsize=12, fontweight='bold', color=text_color,
                bbox=dict(boxstyle="round,pad=0.9,rounding_size=0.2", 
                          facecolor=step['color'], 
                          edgecolor='none', 
                          alpha=0.95))
        
        # Draw horizontal connector arrow to next block
        if i < len(STEPS) - 1:
            arrow_start_x = x + 6.0
            arrow_end_x = x_coords[i+1] - 6.0
            ax.annotate("", 
                        xy=(arrow_end_x, y), 
                        xytext=(arrow_start_x, y),
                        arrowprops=dict(arrowstyle="-|>", 
                                        color=COLOR_FOREST, 
                                        lw=2.5, 
                                        mutation_scale=15))
            
    # Bottom banner matching references
    fig.text(0.5, 0.06, "IEEE Conference Presentation  |  MindMatters Conversational Agent Architecture", 
             fontsize=12, color='#7F8C8D', ha='center', style='italic')
    
    output_path = os.path.join(output_dir, 'Slide_Chatbot_Pipeline.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='#F5F6F8')
    plt.close()
    print(f"Generated slide flowchart at: {output_path}")

if __name__ == '__main__':
    print("Generating chatbot pipeline diagrams...")
    generate_vertical_paper_diagram()
    generate_horizontal_slide_diagram()
    print("Done!")
