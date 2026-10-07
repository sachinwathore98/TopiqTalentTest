const enforceStrictHierarchyScope = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized.' });

    if (['super_admin', 'admin'].includes(user.role)) {
      return next(); // Global access
    }

    if (user.role === 'franchise' || user.role === 'franchise_owner') {
      req.hierarchyScope = { franchiseId: user.id || user._id };
    } else if (user.role === 'asm') {
      req.hierarchyScope = { asmId: user.id || user._id };
    } else if (user.role === 'coordinator') {
      req.hierarchyScope = { coordinatorId: user.id || user._id };
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Hierarchy scoping error.' });
  }
};

module.exports = enforceStrictHierarchyScope;