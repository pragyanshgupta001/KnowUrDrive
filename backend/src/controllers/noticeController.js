import Notice from "../models/Notice.js";


// GET ALL NOTICES for the user's college
export const getNotices = async (req, res) => {
  try {
    const { priority } = req.query;

    const filter = { collegeId: req.user.collegeId };

    if (priority) filter.priority = priority.toUpperCase();

    const notices = await Notice.find(filter)
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.json(notices);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE NOTICE
export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findOne({
      _id: req.params.id,
      collegeId: req.user.collegeId    // scoped — can't read another college's notices
    }).populate("postedBy", "name");

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json(notice);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE NOTICE (TPO only)
export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findOne({
      _id: req.params.id,
      collegeId: req.user.collegeId
    });

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE NOTICE (TPO only)
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findOneAndDelete({
      _id: req.params.id,
      collegeId: req.user.collegeId
    });

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json({ message: "Notice deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};