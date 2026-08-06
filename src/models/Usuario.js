import mongoose from "mongoose";

const direccionSchema = new mongoose.Schema(
  {
    calle: {
      type: String,
      required: [true, "La calle es requerida"],
      trim: true,
    },
    ciudad: {
      type: String,
      required: [true, "La ciudad es requerida"],
      trim: true,
    },
    pais: {
      type: String,
      required: [true, "El país es requerido"],
      trim: true,
    },
    codigo_postal: {
      type: String,
      required: [true, "El código postal es requerido"],
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "El formato del email no es válido",
      ],
    },
    edad: {
      type: Number,
      min: [0, "La edad no puede ser negativa"],
      validate: {
        validator: Number.isInteger,
        message: "La edad debe ser un número entero",
      },
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    direcciones: {
      type: [direccionSchema],
      default: [],
      set: (value) => {
        if (!Array.isArray(value)) {
          throw new mongoose.Error.CastError("Array", value, "direcciones");
        }

        return value;
      },
    },
  },
  {
    versionKey: false,
  },
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
