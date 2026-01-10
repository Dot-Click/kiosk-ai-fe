// Use a simple in-memory store that resets on cold start
// Note: This is for development only. For production, use Vercel KV, Redis, or a database.

let uploadsStore = {};

export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { uploadId, image, code, fileName } = req.body;
      
      // Validate required fields
      if (!uploadId || !image || !code) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: uploadId, image, or code' 
        });
      }

      // Validate image is base64
      if (!image.startsWith('data:image/')) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid image format. Must be base64 image.' 
        });
      }

      // Create upload data
      const uploadData = {
        uploadId,
        image: image.substring(0, 500) + '...', // Store only part for demo
        fullImage: image, // Store full image
        code,
        fileName: fileName || 'uploaded-image.jpg',
        timestamp: Date.now(),
        status: 'uploaded'
      };
      
      // Store in memory (resets on server restart)
      uploadsStore[uploadId] = uploadData;
      
      // Clean up old uploads (older than 5 minutes)
      const now = Date.now();
      for (const id in uploadsStore) {
        if (now - uploadsStore[id].timestamp > 5 * 60 * 1000) {
          delete uploadsStore[id];
        }
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Upload stored successfully',
        uploadId: uploadId
      });
      
    } catch (error) {
      console.error('Upload API error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  } 
  else if (req.method === 'GET') {
    try {
      const { uploadId } = req.query;
      
      if (!uploadId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Upload ID required' 
        });
      }
      
      // Check if upload exists
      const upload = uploadsStore[uploadId];
      
      if (upload) {
        // Check if expired (older than 5 minutes)
        const now = Date.now();
        if (now - upload.timestamp > 5 * 60 * 1000) {
          delete uploadsStore[uploadId];
          return res.status(200).json({ 
            success: true, 
            exists: false,
            expired: true 
          });
        }
        
        return res.status(200).json({ 
          success: true, 
          exists: true, 
          data: upload 
        });
      } else {
        return res.status(200).json({ 
          success: true, 
          exists: false 
        });
      }
    } catch (error) {
      console.error('Get upload error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }
  
  return res.status(405).json({ 
    success: false, 
    error: 'Method not allowed. Use GET or POST.' 
  });
}