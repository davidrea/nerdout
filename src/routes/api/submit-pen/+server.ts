import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Log the submission to the console
		console.log('='.repeat(60));
		console.log('NEW PEN SUBMISSION');
		console.log('='.repeat(60));
		console.log('Timestamp:', data.timestamp);
		console.log('');
		console.log('REQUIRED INFORMATION:');
		console.log('  Pen Name:', data.penName);
		console.log('  Cost (USD):', `$${data.penCost}`);
		console.log('  Nib Material:', data.nibMaterial);
		console.log('');
		console.log('OPTIONAL INFORMATION:');
		console.log('  Description:', data.penDescription || '(Not provided)');
		console.log('  Body Material:', data.bodyMaterial || '(Not provided)');
		console.log('  Filling System:', data.fillingSystem || '(Not provided)');
		console.log('  Product URL:', data.productUrl || '(Not provided)');
		console.log('  Additional Notes:', data.additionalNotes || '(Not provided)');
		console.log('');
		console.log('SUBMITTER:');
		console.log('  Email:', data.submitterEmail || '(Not provided)');
		console.log('='.repeat(60));

		// TODO: In the future, send email via Mailgun API
		// Example:
		// await sendMailgunEmail({
		//   to: 'admin@nerdout.com',
		//   subject: `New Pen Submission: ${data.penName}`,
		//   text: formatSubmissionEmail(data)
		// });

		return json({ success: true, message: 'Pen submitted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error processing pen submission:', error);
		return json({ success: false, message: 'Failed to submit pen' }, { status: 500 });
	}
};
