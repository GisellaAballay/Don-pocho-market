
import mongoose from 'mongoose';

// const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB concectado en : ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error de conexión a MongoDB`, error.message);
    process.exit(1);
  }
};
// mongoose.connect(MONGO_URI)
  // .then(() => {
    // console.log('Conectado a MongoDB');
    // app.listen(PORT, () => {
      // console.log(`Servidor corriendo en puerto ${PORT}`);
    // });
  // })
  // .catch((err) => {
    // console.error('Error de conexión a MongoDB:', err.message);
  // });

  export default connectDB;