const Contact = require("../models/Contact");

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const userId = req.user?.id; // assuming you have auth middleware setting req.user

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const contact = new Contact({
      user: userId,
      name,
      email,
      subject,
      message,
    });

    await contact.save();
    res.status(201).json({ success: true, message: "Message submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Admin: get all contacts with user info
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("user", "name email")  // fetch user's name & email
      .sort({ createdAt: -1 });

    res.json({ success: true, contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Resolve a contact
const resolveContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.json({ success: true, message: "Message marked as resolved", contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
   submitContact,
    getContacts,
    deleteContact,
    resolveContact,

  };
