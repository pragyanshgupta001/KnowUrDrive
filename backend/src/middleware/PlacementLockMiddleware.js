import Drive from "../models/Drive.js";
import { checkPlacementLock } from "../services/eligibilityService.js";

const placementLockMiddleware = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.driveId);

    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    const { locked, reason, detail } = await checkPlacementLock(req.user, drive);

    if (locked) {
      return res.status(403).json({ eligible: false, message: reason, detail });
    }

    next();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default placementLockMiddleware;