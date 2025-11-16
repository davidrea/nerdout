<script lang="ts">
	import Modal from './Modal.svelte';

	export let isOpen = false;
	export let onClose: () => void = () => {};

	// Required fields
	let penName = '';
	let penCost = '';
	let nibMaterial = '';

	// Optional fields
	let penDescription = '';
	let bodyMaterial = '';
	let fillingSystem = '';
	let productUrl = '';
	let submitterEmail = '';
	let additionalNotes = '';

	let isSubmitting = false;
	let submitError = '';
	let submitSuccess = false;

	async function handleSubmit() {
		isSubmitting = true;
		submitError = '';
		submitSuccess = false;

		try {
			const response = await fetch('/api/submit-pen', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					penName,
					penCost: parseFloat(penCost),
					nibMaterial,
					penDescription,
					bodyMaterial,
					fillingSystem,
					productUrl,
					submitterEmail,
					additionalNotes,
					timestamp: new Date().toISOString(),
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to submit pen');
			}

			submitSuccess = true;

			// Reset form and close after a brief delay
			setTimeout(() => {
				resetForm();
				onClose();
			}, 2000);
		} catch (error) {
			submitError = 'Failed to submit pen suggestion. Please try again.';
			console.error('Error submitting pen:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		penName = '';
		penCost = '';
		nibMaterial = '';
		penDescription = '';
		bodyMaterial = '';
		fillingSystem = '';
		productUrl = '';
		submitterEmail = '';
		additionalNotes = '';
		submitError = '';
		submitSuccess = false;
	}

	function handleClose() {
		resetForm();
		onClose();
	}

	$: isFormValid = penName.trim() !== '' && penCost.trim() !== '' && nibMaterial.trim() !== '';
</script>

<Modal {isOpen} title="Submit a Fountain Pen" onClose={handleClose}>
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div>
			<p class="text-sm text-gray-600 mb-4">
				Suggest a fountain pen to add to our database. Fields marked with * are required.
			</p>
		</div>

		<!-- Required Fields -->
		<div>
			<label for="pen-name" class="block text-sm font-medium text-gray-700 mb-1">
				Pen Name *
			</label>
			<input
				id="pen-name"
				type="text"
				bind:value={penName}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
				placeholder="e.g., Pilot Metropolitan"
				disabled={isSubmitting}
			/>
		</div>

		<div>
			<label for="pen-cost" class="block text-sm font-medium text-gray-700 mb-1">
				Cost (USD) *
			</label>
			<input
				id="pen-cost"
				type="number"
				step="0.01"
				min="0"
				bind:value={penCost}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
				placeholder="e.g., 25.00"
				disabled={isSubmitting}
			/>
		</div>

		<div>
			<label for="nib-material" class="block text-sm font-medium text-gray-700 mb-1">
				Nib Material *
			</label>
			<select
				id="nib-material"
				bind:value={nibMaterial}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
				disabled={isSubmitting}
			>
				<option value="">Select nib material</option>
				<option value="steel">Steel</option>
				<option value="titanium">Titanium</option>
				<option value="14k_gold">14k Gold</option>
				<option value="18k_gold">18k Gold</option>
				<option value="21k_gold">21k Gold</option>
				<option value="palladium">Palladium</option>
			</select>
		</div>

		<!-- Optional Fields -->
		<div>
			<label for="pen-description" class="block text-sm font-medium text-gray-700 mb-1">
				Description (Optional)
			</label>
			<textarea
				id="pen-description"
				bind:value={penDescription}
				rows="2"
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
				placeholder="Brief description of the pen..."
				disabled={isSubmitting}
			></textarea>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="body-material" class="block text-sm font-medium text-gray-700 mb-1">
					Body Material (Optional)
				</label>
				<input
					id="body-material"
					type="text"
					bind:value={bodyMaterial}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
					placeholder="e.g., Resin"
					disabled={isSubmitting}
				/>
			</div>

			<div>
				<label for="filling-system" class="block text-sm font-medium text-gray-700 mb-1">
					Filling System (Optional)
				</label>
				<input
					id="filling-system"
					type="text"
					bind:value={fillingSystem}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
					placeholder="e.g., Cartridge/Converter"
					disabled={isSubmitting}
				/>
			</div>
		</div>

		<div>
			<label for="product-url" class="block text-sm font-medium text-gray-700 mb-1">
				Product URL (Optional)
			</label>
			<input
				id="product-url"
				type="url"
				bind:value={productUrl}
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
				placeholder="https://..."
				disabled={isSubmitting}
			/>
		</div>

		<div>
			<label for="additional-notes" class="block text-sm font-medium text-gray-700 mb-1">
				Additional Notes (Optional)
			</label>
			<textarea
				id="additional-notes"
				bind:value={additionalNotes}
				rows="2"
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
				placeholder="Any other information about this pen..."
				disabled={isSubmitting}
			></textarea>
		</div>

		<div>
			<label for="submitter-email" class="block text-sm font-medium text-gray-700 mb-1">
				Your Email (Optional)
			</label>
			<input
				id="submitter-email"
				type="email"
				bind:value={submitterEmail}
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
				placeholder="your.email@example.com"
				disabled={isSubmitting}
			/>
			<p class="text-xs text-gray-500 mt-1">
				Include your email if you'd like us to follow up
			</p>
		</div>

		{#if submitError}
			<div class="bg-red-50 border border-red-200 rounded-md p-3">
				<p class="text-sm text-red-800">{submitError}</p>
			</div>
		{/if}

		{#if submitSuccess}
			<div class="bg-green-50 border border-green-200 rounded-md p-3">
				<p class="text-sm text-green-800">Pen submitted successfully! Thank you for your contribution.</p>
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
				disabled={isSubmitting || !isFormValid}
			>
				{isSubmitting ? 'Submitting...' : 'Submit Pen'}
			</button>
		</div>
	</form>
</Modal>
