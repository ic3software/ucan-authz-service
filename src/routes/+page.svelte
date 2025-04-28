<script lang="ts">
	import { exportPublicKey } from '$lib/crypto';
	import { getKey } from '$lib/crypto';

	let inputToken = $state('');
	let successMessage = $state('');
	let errorMessage = $state('');

	async function checkPermission(permissionType: string) {
		successMessage = '';
		errorMessage = '';

		try {
			const publicKey = await getKey('publicKey');
			if (!publicKey) {
				throw new Error('Public key not found');
			}

			console.log('publicKey', publicKey);

			const xPublicKey = await exportPublicKey(publicKey);
			console.log('xPublicKey', xPublicKey);
			const headers = {
				'X-Public-Key': xPublicKey,
				'Authorization': `Bearer ${inputToken}`
			};

			console.log('headers', headers);

			let response;
			switch (permissionType) {
				case 'read':
					response = await fetch('/api/email', { method: 'GET', headers });
					break;
				case 'create':
					response = await fetch('/api/email', { method: 'POST', headers });
					break;
				case 'delete':
					response = await fetch('/api/email', { method: 'DELETE', headers });
					break;
				default:
					throw new Error('Invalid permission type');
			}

			if (response.status === 200) {
				successMessage = `${permissionType} permission granted`;
			} else if (response.status === 401) {
				errorMessage = `${permissionType} permission denied`;
			} else {
				errorMessage = `Unexpected response status: ${response.status}`;
			}
		} catch (error: any) {
			console.error(`Error checking ${permissionType} permission:`, error);
			errorMessage = `Error checking ${permissionType} permission: ${error.message}`;
		}
	}
</script>

<div class="container mx-auto p-6">
	<h1 class="mb-4 text-2xl font-bold">Service Authorization</h1>

	<p class="mb-4">
		<strong>Explanation:</strong> Use the button below to navigate to the Delegate page. This allows
		you to authorize the service to access your resources.
	</p>

	<button
		class="mb-4 rounded bg-green-500 px-6 py-3 text-white shadow-md transition duration-300 hover:bg-green-600"
		onclick={() => (window.location.href = '/delegate')}
	>
		Go to Delegate Page
	</button>

	<p class="mb-4">
		After returning to the homepage, paste your UCAN token below. You can then click the buttons to
		check if you have the respective permissions.
	</p>

	<textarea bind:value={inputToken} rows="6" class="mb-4 w-full rounded border p-3"></textarea>

	<div class="flex space-x-4">
		<button
			onclick={() => checkPermission('read')}
			class="rounded bg-blue-500 px-6 py-3 text-white shadow-md transition duration-300 hover:bg-blue-600"
		>
			Check Read Email Permission
		</button>
		<button
			onclick={() => checkPermission('create')}
			class="rounded bg-blue-500 px-6 py-3 text-white shadow-md transition duration-300 hover:bg-blue-600"
		>
			Check Create Email Permission
		</button>
		<button
			onclick={() => checkPermission('delete')}
			class="rounded bg-blue-500 px-6 py-3 text-white shadow-md transition duration-300 hover:bg-blue-600"
		>
			Check Delete Email Permission
		</button>
	</div>

	<p class="mt-4 text-green-500">{successMessage}</p>
	<p class="mt-4 text-red-500">{errorMessage}</p>
</div>
