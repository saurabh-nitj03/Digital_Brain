interface SharedLink {
  _id: string;
  hash: string;
  userId: {
    _id: string;
    username: string;
  };
  createdAt?: Date;
  updatedAt?:Date
}
export  type {SharedLink}