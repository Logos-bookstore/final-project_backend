import mongoose from 'mongoose';

export async function database() {
  try {
    await mongoose.connect(`${process.env.DATABASE}`);
    console.log('connected to database');
  } catch (error) {
    console.log(error);
  }
}
