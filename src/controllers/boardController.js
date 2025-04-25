import createErrors from "../utils/errors.js";
import Board from "../models/Board.js";
import createResponse from "../utils/response.js";

export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;

    const { _id } = req.user;
    const board = new Board({ title, userId: _id });
    await board.save();
    createResponse(res, 200, "Board created successfully", { title });
  } catch (error) {
    console.log(error);
    createErrors(res, 500, "SERVER_ERROR", {});
  }
};

export const getBoards = async (req, res) => {
  try {
    const { _id } = req.user;
    const boards = await Board.find({ userId: _id });
    createResponse(res, 200, "Boards fetched successfully", { boards });
  } catch (error) {
    console.log(error);
    createErrors(res, 500, "SERVER_ERROR", {});
  }
};
