import { Schema, model } from "mongoose";
import { crudControllers } from "../services/crud";

const tokenSchema = Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user" },
		token: String,
		expires: Date,
		createdByIp: String,
		revoked: Date,
		revokedByIp: String,
		replacedByToken: String,
	},
	{ timestamps: true }
);

tokenSchema.virtual("isExpired").get(function () {
	return Date.now() >= this.expires;
});

tokenSchema.virtual("isActive").get(function () {
	return this.revoked === undefined && !this.isExpired;
});

tokenSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		// remove props when object is serialized
		delete ret._id;
		delete ret.id;
		delete ret.user;
	},
});

export const Token = model("RefreshToken", tokenSchema);

export default crudControllers(Token);
