import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  description: string;
  content?: string;
  link: string;
  pubDate: Date;
  source: string;
  sourceId?: string;
  category: 'F1' | 'MotoGP' | 'Other';
  imageUrl?: string;
  tags?: string[];
  author?: string;
  isProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String 
    },
    link: { 
      type: String, 
      required: true,
      unique: true 
    },
    pubDate: { 
      type: Date, 
      required: true 
    },
    source: { 
      type: String, 
      required: true 
    },
    sourceId: { 
      type: String 
    },
    category: { 
      type: String, 
      enum: ['F1', 'MotoGP', 'Other'],
      required: true 
    },
    imageUrl: { 
      type: String 
    },
    tags: [{ 
      type: String 
    }],
    author: { 
      type: String 
    },
    isProcessed: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true 
  }
);

// Create indexes for better query performance
ArticleSchema.index({ pubDate: -1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ source: 1 });

// Prevent duplicate articles based on link
ArticleSchema.index({ link: 1 }, { unique: true });

// Method to format dates in UK format (DD/MM/YYYY)
ArticleSchema.methods.formatDate = function() {
  const date = this.pubDate;
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Virtual for formatted publication date
ArticleSchema.virtual('formattedPubDate').get(function() {
  return this.formatDate();
});

// Export the model and return your IArticle interface
export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
