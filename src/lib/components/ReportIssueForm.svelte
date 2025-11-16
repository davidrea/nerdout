<script lang="ts">
	import Modal from './Modal.svelte';

	export let isOpen = false;
	export let penName: string = '';
	export let penId: string = '';
	export let onClose: () => void = () => {};

	let issueDescription = '';
	let contactEmail = '';
	let isSubmitting = false;
	let submitError = '';
	let submitSuccess = false;

	async function handleSubmit() {
		isSubmitting = true;
		submitError = '';
		submitSuccess = false;

		try {
			const response = await fetch('/api/report-issue', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					penId,
					penName,
					issueDescription,
					contactEmail,
					timestamp: new Date().toISOString(),
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to submit report');
			}

			submitSuccess = true;

			// Reset form and close after a brief delay
			setTimeout(() => {
				resetForm();
				onClose();
			}, 1500);
		} catch (error) {
			submitError = 'Failed to submit report. Please try again.';
			console.error('Error submitting report:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		issueDescription = '';
		contactEmail = '';
		submitError = '';
		submitSuccess = false;
	}

	function handleClose() {
		resetForm();
		onClose();
	}
</script>

<Modal {isOpen} title="Report Incorrect Information" onClose={handleClose}>
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div>
			<p class="text-sm text-gray-600 mb-4">
				Help us improve the data for <strong>{penName}</strong>. No fields are required—just click Report to alert the admin.
			</p>
		</div>

		<div>
			<label for="issue-description" class="block text-sm font-medium text-gray-700 mb-1">
				What's wrong? (Optional)
			</label>
			<textarea
				id="issue-description"
				bind:value={issueDescription}
				rows="4"
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
				placeholder="Describe the incorrect information..."
				disabled={isSubmitting}
			></textarea>
		</div>

		<div>
			<label for="contact-email" class="block text-sm font-medium text-gray-700 mb-1">
				Your email (Optional)
			</label>
			<input
				id="contact-email"
				type="email"
				bind:value={contactEmail}
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
				placeholder="your.email@example.com"
				disabled={isSubmitting}
			/>
			<p class="text-xs text-gray-500 mt-1">
				Include your email if you'd like a response
			</p>
		</div>

		{#if submitError}
			<div class="bg-red-50 border border-red-200 rounded-md p-3">
				<p class="text-sm text-red-800">{submitError}</p>
			</div>
		{/if}

		{#if submitSuccess}
			<div class="bg-green-50 border border-green-200 rounded-md p-3">
				<p class="text-sm text-green-800">Report submitted successfully! Thank you.</p>
			</div>
		{/if}

		<div class="flex justify-end gap-3 pt-2">
			<button
				type="button"
				on:click={handleClose}
				class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
				disabled={isSubmitting}
			>
				Cancel
			</button>
			<button
				type="submit"
				class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Submitting...' : 'Report'}
			</button>
		</div>
	</form>
</Modal>
