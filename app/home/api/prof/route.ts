// home/api/prof/route.ts

// app/api/prof/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Professor from "@/models/Professor";

export async function GET() {
  try {
    await connectDB();
    const professor = await Professor.findOne({});
    return NextResponse.json(professor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch professor data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const professor = await Professor.create(body);
    return NextResponse.json(professor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create professor data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const professor = await Professor.findOneAndUpdate({}, body, {
      new: true,
      runValidators: true,
    });
    if (!professor) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 });
    }
    return NextResponse.json(professor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update professor data" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const professor = await Professor.findOneAndDelete({});
    if (!professor) {
      return NextResponse.json({ error: "Professor not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Professor deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete professor data" }, { status: 500 });
  }
}
