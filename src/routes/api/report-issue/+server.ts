import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Log the report to the console
		console.log('='.repeat(60));
		console.log('INCORRECT INFORMATION REPORT');
		console.log('='.repeat(60));
		console.log('Timestamp:', data.timestamp);
		console.log('Pen ID:', data.penId);
		console.log('Pen Name:', data.penName);
		console.log('Issue Description:', data.issueDescription || '(No description provided)');
		console.log('Contact Email:', data.contactEmail || '(No email provided)');
		console.log('='.repeat(60));

		// TODO: In the future, send email via Mailgun API
		// Example:
		// await sendMailgunEmail({
		//   to: 'admin@nerdout.com',
		//   subject: `Issue Report: ${data.penName}`,
		//   text: formatReportEmail(data)
		// });

		return json({ success: true, message: 'Report submitted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error processing report:', error);
		return json({ success: false, message: 'Failed to submit report' }, { status: 500 });
	}
};
