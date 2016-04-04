'use strict';

const sendResponse = require('../utils/sendResponse');
const bookStateRepo = require('../repositories/bookState');

/**
 * @swagger
 * /book/request/{bookId}:
 *   put:
 *     operationId: requestBook
 *     description: Send a request to borrow a book
 *     summary: Borrow a book
 *     tags:
 *      - Book Request
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is requested.
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.requestBook = function (req, res) {
  const bookState = req.bookSharing.bookState;
  const currentUser = req.bookSharing.currentAuthenticatedUser;

  if(bookState.requestedBy) {
    const foundRequestedUser = bookState.requestedBy.find((user) => {
      return user._id.toString() == currentUser._id.toString()
    });

    if (foundRequestedUser) {
      return sendResponse(res, {
        'message': 'Book request exists',
        status: false
      }, 400);
    }

  } else {
    bookState.requestedBy = [];
  }

  bookState.requestedBy.push(currentUser._id);

  bookStateRepo.updateBookState(bookState).then(function(updatedBookState) {
    return bookStateRepo.findById(updatedBookState._id).then(function(foundBookState){
      sendResponse(res, {'message': 'Book request created', status: true, data: foundBookState}, 200);
    }).catch(function(err) {
      sendResponse(res, {'message': 'Internal server error. Could not find updated book state', status: false}, 500);
    });

  }).catch(function(err) {
    sendResponse(res, {'message': 'Internal server error. Could not create book request', status: false}, 500);
  });
};

/**
 * @swagger
 * /book/request/approve/{bookId}/{userId}:
 *   put:
 *     operationId: approveBookRequest
 *     description: Approve the request for borrowing book
 *     summary: Lend a book
 *     tags:
 *      - Book Request
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is requested.
 *        type: string
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The id of user whose request needs to be approved.
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.approveBookRequest = function (req, res) {

}

/**
 * @swagger
 * /book/request/reject/{bookId}/{userId}:
 *   put:
 *     operationId: rejectBookRequest
 *     description: Reject the request for borrowing book
 *     summary: Reject the request for borrowing a book
 *     tags:
 *      - Book Request
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book whose request needs to be rejected.
 *        type: string
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The id of user whose request needs to be rejected.
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.rejectBookRequest = function (req, res) {
}


/**
 * @swagger
 * /book/return/{bookId}/{userId}:
 *   put:
 *     operationId: markBookAsReturned
 *     description: Return borrowed book
 *     summary: Return Book
 *     tags:
 *      - Book Return and Lost Operations
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is returned
 *        type: string
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The id of user who is returning the book. If not provided current logged in user is used
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.markBookAsReturned = function (req, res) {
};


/**
 * @swagger
 * /book/lost/{bookId}/{userId}:
 *   put:
 *     operationId: markBookAsLost
 *     description: Mark borrowed book as lost
 *     summary: Mark lost book
 *     tags:
 *      - Book Return and Lost Operations
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is returned
 *        type: string
 *      - name: userId
 *        in: path
 *        required: true
 *        description: 'The id of user who had borrowed the book.
 *        If not provided, the recent borrower will be used as default.'
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.markBookAsLost = function (req, res) {
};
