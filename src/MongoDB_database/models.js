const {model, Schema} = require('mongoose');

const EnterpriseSchema = new Schema(
	{
		AGBCode: {
			type: String,
			index: true,
		},
		Name: {
			type: String,
		},
		TradeName: {
			type: String,
		}
	}, {
		collection: 'enterprise'
	}
);

const Enterprise = model('Enterprise', EnterpriseSchema);

module.exports = {
	EnterpriseSchema,
	Enterprise
}