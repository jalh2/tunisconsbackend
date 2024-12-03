const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutSchema = new Schema({
  mainImage: {
    url: String,
    alt: String
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  vision: {
    type: String,
    required: true
  },
  values: [{
    icon: String,
    title: String,
    description: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// static getAboutContent method
aboutSchema.statics.getAboutContent = async function() {
  try {
    const content = await this.findOne();
    if (!content) {
      throw Error('No about content found');
    }
    return content;
  } catch (error) {
    throw Error(error.message);
  }
}

// static updateAboutContent method
aboutSchema.statics.updateAboutContent = async function(contentData) {
  try {
    const content = await this.findOne();
    
    if (content) {
      Object.assign(content, contentData);
      await content.save();
    } else {
      await this.create(contentData);
    }
    
    return await this.findOne();
  } catch (error) {
    throw Error(error.message);
  }
}

// static updateImage method
aboutSchema.statics.updateImage = async function(imageUrl, alt) {
  try {
    const content = await this.findOne();
    
    if (content) {
      content.mainImage = {
        url: imageUrl,
        alt: alt || 'About page image'
      };
      await content.save();
    } else {
      await this.create({
        mainImage: {
          url: imageUrl,
          alt: alt || 'About page image'
        }
      });
    }
    
    return await this.findOne();
  } catch (error) {
    throw Error(error.message);
  }
}

module.exports = mongoose.model('About', aboutSchema);
