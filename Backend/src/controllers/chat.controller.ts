// import { Request, Response } from 'express';
// import { AIAgent } from '../utils/aiAgent';

// const aiAgent = new AIAgent();

// export class ChatController {
//   /**
//    * Start a new chat conversation
//    */
//   static async startChat(req: Request, res: Response) {
//     try {
//       const { message } = req.body;
//       const userId = req.user?.id || req.body.userId; // Assuming user is authenticated

//       if (!message) {
//         return res.status(400).json({
//           success: false,
//           message: 'Message is required'
//         });
//       }

//       if (!userId) {
//         return res.status(401).json({
//           success: false,
//           message: 'User authentication required'
//         });
//       }

//       const result = await aiAgent.startChat(userId, message);

//       if (result.success) {
//         res.status(200).json({
//           success: true,
//           conversationId: result.conversationId,
//           response: result.response
//         });
//       } else {
//         res.status(500).json({
//           success: false,
//           message: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Error in startChat:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error'
//       });
//     }
//   }

//   /**
//    * Continue an existing chat conversation
//    */
//   static async continueChat(req: Request, res: Response) {
//     try {
//       const { conversationId, message } = req.body;
//       const userId = req.user?.id || req.body.userId;

//       if (!conversationId || !message) {
//         return res.status(400).json({
//           success: false,
//           message: 'Conversation ID and message are required'
//         });
//       }

//       if (!userId) {
//         return res.status(401).json({
//           success: false,
//           message: 'User authentication required'
//         });
//       }

//       const result = await aiAgent.continueChat(userId, conversationId, message);

//       if (result.success) {
//         res.status(200).json({
//           success: true,
//           response: result.response
//         });
//       } else {
//         res.status(500).json({
//           success: false,
//           message: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Error in continueChat:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error'
//       });
//     }
//   }

//   /**
//    * Get user's conversations
//    */
//   static async getConversations(req: Request, res: Response) {
//     try {
//       const userId = req.user?.id || req.params.userId;

//       if (!userId) {
//         return res.status(401).json({
//           success: false,
//           message: 'User authentication required'
//         });
//       }

//       const result = await aiAgent.getUserConversations(userId);

//       if (result.success) {
//         res.status(200).json({
//           success: true,
//           conversations: result.conversations
//         });
//       } else {
//         res.status(500).json({
//           success: false,
//           message: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Error in getConversations:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error'
//       });
//     }
//   }

//   /**
//    * Get a specific conversation
//    */
//   static async getConversation(req: Request, res: Response) {
//     try {
//       const { conversationId } = req.params;
//       const userId = req.user?.id || req.query.userId as string;

//       if (!conversationId) {
//         return res.status(400).json({
//           success: false,
//           message: 'Conversation ID is required'
//         });
//       }

//       if (!userId) {
//         return res.status(401).json({
//           success: false,
//           message: 'User authentication required'
//         });
//       }

//       const result = await aiAgent.getConversation(conversationId, userId);

//       if (result.success) {
//         res.status(200).json({
//           success: true,
//           conversation: result.conversation
//         });
//       } else {
//         res.status(404).json({
//           success: false,
//           message: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Error in getConversation:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error'
//       });
//     }
//   }

//   /**
//    * Update conversation title
//    */
//   static async updateConversationTitle(req: Request, res: Response) {
//     try {
//       const { conversationId } = req.params;
//       const { title } = req.body;
//       const userId = req.user?.id || req.body.userId;

//       if (!conversationId || !title) {
//         return res.status(400).json({
//           success: false,
//           message: 'Conversation ID and title are required'
//         });
//       }

//       if (!userId) {
//         return res.status(401).json({
//           success: false,
//           message: 'User authentication required'
//         });
//       }

//       const result = await aiAgent.updateConversationTitle(conversationId, userId, title);

//       if (result.success) {
//         res.status(200).json({
//           success: true,
//           message: result.message
//         });
//       } else {
//         res.status(500).json({
//           success: false,
//           message: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Error in updateConversationTitle:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error'
//       });
//     }
//   }

//   /**
//    * Delete a conversation
//    */
//   static async deleteConversation(req: Request, res: Response) {
//     try {
//       const { conversationId } = req.params;
//       const userId = req.user?.id || req.query.userId as string;

//       if (!conversationId) {
//         return res.status(400).json({
//           success: false,
//           message: 'Conversation ID is required'
//         });
//       }

//       if (!userId) {
//         return res.status(401).json({
//           success: false,
//           message: 'User authentication required'
//         });
//       }

//       const result = await aiAgent.deleteConversation(conversationId, userId);

//       if (result.success) {
//         res.status(200).json({
//           success: true,
//           message: result.message
//         });
//       } else {
//         res.status(404).json({
//           success: false,
//           message: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Error in deleteConversation:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal server error'
//       });
//     }
//   }
// } 