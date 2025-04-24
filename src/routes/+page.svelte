<script lang="ts">
    let inputToken = $state('');

    function checkPermission(permissionType: string) {
        console.log(`Checking ${permissionType} permission for token:`, inputToken);
    }
</script>

<div class="container mx-auto p-6">
    <h1 class="mb-4 text-2xl font-bold">Service Authorization</h1>

    <p class="mb-4">
        <strong>Explanation:</strong> Use the button below to navigate to the Delegate page. This allows you to authorize the service to access your resources.
    </p>

    <button
        onclick={() => window.location.href = '/delegate'}
        class="rounded bg-green-500 px-6 py-3 text-white shadow-md transition duration-300 hover:bg-green-600 mb-4"
    >
        Go to Delegate Page
    </button>

    <p class="mb-4">
        After returning to the homepage, paste your UCAN token below. You can then click the buttons to check if you have the respective permissions.
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
</div>
