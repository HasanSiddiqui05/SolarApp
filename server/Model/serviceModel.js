import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        services: [{
            serviceType: {
                type: String,
                required: true
            },
            costIncurred: { 
                type: Number, 
                required: true, 
            },
            costReceived: { 
                type: Number, 
                required: true,
            },
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)

const Services = mongoose.model('Services', serviceSchema)
export default Services;
