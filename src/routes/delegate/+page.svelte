<script lang="ts">
	import type { PageProps } from './$types';
	import * as ucans from '@ucans/ucans';
	import { getKey } from '$lib/crypto';
	import { onMount } from 'svelte';
	import { toDidableKey } from '$lib/keys';

	let { data }: PageProps = $props();

	let serverDidKey = $state(data.serverDidKey);
	let inputToken = $state('');
	let capabilities = $state<ucans.Capability[]>([]);
	let parsed = $state(false);
	let error = $state('');
	let selectedCaps = $state<ucans.Capability[]>([]);
	let keypair: { publicKey: CryptoKey; privateKey: CryptoKey } | null = $state(null);
	let finalUcan: string | null = $state('');

	async function parseToken() {
		error = '';
		parsed = false;
		try {
			const decoded = ucans.parse(inputToken);
			capabilities = decoded.payload.att || [];
			parsed = true;
		} catch (e) {
			error = 'Invalid UCAN token: ' + (e as Error).message;
		}
	}

	function toggleSelection(cap: ucans.Capability) {
		const exists = selectedCaps.find((sel) => ucans.ability.isEqual(sel.can, cap.can));
		if (exists) {
			selectedCaps = selectedCaps.filter((sel) => !ucans.ability.isEqual(sel.can, cap.can));
		} else {
			selectedCaps = [...selectedCaps, cap];
		}
	}

	function formatCapability(cap: ucans.Capability): string {
		const can = formatAbility(cap.can);
		const res = formatResource(cap.with);
		return `${can} @ ${res}`;
	}

	function formatAbility(ability: any): string {
		if (typeof ability === 'string') return ability;
		return `${ability.namespace}:${ability.segments?.join('.') ?? ability.segment ?? 'unknown'}`;
	}

	function formatResource(resource: ucans.ResourcePointer): string {
		if (typeof resource === 'string') return resource;
		return `${resource.scheme ?? 'res'}:${resource.hierPart ?? 'unknown'}`;
	}

	async function buildUcan() {
		if (!keypair) {
			error = 'Keypair not available';
			return;
		}

		try {
			const selectedCapabilities = capabilities.filter((cap) => selectedCaps.includes(cap));
			const newUcan = await ucans.build({
				issuer: await toDidableKey(keypair),
				audience: serverDidKey,
				lifetimeInSeconds: 60 * 60,
				capabilities: selectedCapabilities,
				proofs: [inputToken]
			});
			const token = ucans.encode(newUcan);
			finalUcan = token;
		} catch (e) {
			console.error(e);
			error = 'Failed to build UCAN: ' + (e as Error).message;
		}
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).then(
			() => {
				alert('Token copied to clipboard!');
			},
			(err) => {
				console.error('Could not copy text: ', err);
			}
		);
	}

	onMount(async () => {
		const storedPrivateKey = await getKey('privateKey');
		if (storedPrivateKey) {
			keypair = {
				publicKey: (await getKey('publicKey')) as CryptoKey,
				privateKey: storedPrivateKey
			};
		} else {
			error = 'Failed to retrieve keypair from storage';
		}
	});
</script>

<div class="container mx-auto p-6">
	<h1 class="mb-4 text-2xl font-bold">Delegate Access to New Service</h1>

	<p class="mb-4"><strong>Server DID Key:</strong> {serverDidKey}</p>

	<label for="token" class="mb-2 block text-lg font-medium"
		>Paste your UCAN token from Server 1:</label
	>

	<textarea bind:value={inputToken} rows="6" class="mb-4 w-full rounded border p-3"></textarea>

	<button
		onclick={parseToken}
		class="rounded bg-blue-500 px-6 py-3 text-white shadow-md transition duration-300 hover:bg-blue-600"
	>
		Parse Token
	</button>

	{#if error}
		<p class="mt-4 text-red-600">{error}</p>
	{/if}

	{#if parsed}
		<h2 class="mt-8 text-xl font-semibold">Select capabilities to delegate:</h2>
		<div class="mt-4 space-y-2">
			{#each capabilities as cap}
				<div>
					<label>
						<input
							type="checkbox"
							onchange={() => toggleSelection(cap)}
							checked={selectedCaps.find((sel) => ucans.ability.isEqual(sel.can, cap.can)) !==
								undefined}
						/>
						{formatCapability(cap)}
					</label>
				</div>
			{/each}
		</div>
		<button
			onclick={buildUcan}
			class="mt-4 rounded bg-green-500 px-6 py-3 text-white shadow-md transition duration-300 hover:bg-green-600"
		>
			Generate New UCAN
		</button>
	{/if}

	{#if finalUcan}
		<h2 class="mt-8 text-xl font-semibold">Generated UCAN:</h2>
		<p class="mt-4 break-words">{finalUcan}</p>
		<button
			onclick={() => copyToClipboard(finalUcan ?? '')}
			class="mt-4 rounded bg-yellow-500 px-6 py-3 text-white shadow-md transition duration-300 hover:bg-yellow-600"
		>
			Copy Token
		</button>
	{/if}

	<a
		href="/"
		class="mt-8 block rounded bg-gray-500 px-6 py-3 text-center text-white shadow-md transition duration-300 hover:bg-gray-600"
	>
		Go to Home
	</a>
</div>
