import Services from "../Model/serviceModel.js";

export const recordService = async (req, res) => {
  try {
    const { services } = req.body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: "At least one service item is required.", });
    }
 
    for (const item of services) {
      if (!item.serviceType || item.serviceType.trim() === "") {
        return res.status(400).json({ success: false, message: "Each service must have a serviceType.", });
      }
      if (item.costIncurred == null || isNaN(item.costIncurred)) {
        return res.status(400).json({ success: false, message: `Invalid costIncurred value for service: ${item.serviceType}`,});
      }
      if (item.costReceived == null || isNaN(item.costReceived)) {
        return res.status(400).json({ success: false, message: `Invalid costReceived value for service: ${item.serviceType}`,});
      }
    }

    const totalAmount = services.reduce(
      (sum, item) => sum + Number(item.costReceived || 0),
      0
    );

    const service = new Services({
      services,
      totalAmount,
    });

    await service.save();

    res.status(201).json({ success: true, message: "Service record added successfully.", data: service, });
  } catch (error) {
    console.error("Error recording service:", error);
    res.status(500).json({ success: false, message: "Server error while recording service.", });
  }
};

export const listSales = async (req, res) => {
  try{

  }catch(err){
    console.error("Error recording service:", error);
    res.status(500).json({ success: false, message: "Server error while recording service.", });
  }
}

export const listServices = async (req, res) => {
  try {
    const services = await Services.find();

    

    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("List Sales Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};