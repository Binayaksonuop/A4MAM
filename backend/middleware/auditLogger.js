const AuditLog = require('../models/AuditLog');

const logAction = (action, entity) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;

    // Override send to intercept the response
    res.send = function (body) {
      // Revert to original send to avoid infinite loops
      res.send = originalSend;

      // Only log successful actions
      if (res.statusCode >= 200 && res.statusCode < 300 && req.admin) {
        let parsedBody = {};
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          // not json
        }
        
        // Asynchronously save the log
        AuditLog.create({
          userId: req.admin._id,
          action: action,
          entity: entity,
          oldValue: req.body, // In a real app we'd fetch the old value before update, but this is a start
          newValue: parsedBody.data || parsedBody
        }).catch(err => console.error('Audit Log Error:', err));
      }

      // Call original send
      return originalSend.call(this, body);
    };

    next();
  };
};

module.exports = { logAction };
