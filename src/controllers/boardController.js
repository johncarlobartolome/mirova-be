import { ApiResponse } from "../responses/apiResponse.js";
import Board from "../models/Board.js";

export const createBoard = async (req, res, next) => {
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

export const getBoards = async (req, res, next) => {
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

export const updateBoard = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { boardId } = req.params;

    const updatedFields = {
      title,
    };

    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      {
        $set: updatedFields,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      success: true,
      message: "Board updated successfully.",
      data: {
        board: updatedBoard,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
