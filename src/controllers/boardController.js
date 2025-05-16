import { ApiResponse } from "../responses/apiResponse.js";
import Board from "../models/Board.js";

export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;

    const { _id } = req.user;
    const board = new Board({ title, userId: _id });
    await board.save();
    return res.status(200).json({
      success: true,
      message: "Board created successfully.",
      data: {
        title,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getBoards = async (req, res) => {
  try {
    const { _id } = req.user;
    const boards = await Board.find({ userId: _id });
    return res.status(200).json({
      success: true,
      message: "Boards fetched successfully.",
      data: {
        boards,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
