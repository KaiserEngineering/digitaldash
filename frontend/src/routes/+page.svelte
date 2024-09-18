<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import toast from 'svelte-french-toast';

	let { data }: { data: { config: Config; constants: any } } = $props();

	// Ensure that cards is initialized as an array
	let cards: Record<string, View> = $state(data.config.views || {});
	$inspect(data);

	function addCard() {
		const newId = cards ? Math.max(...Object.keys(cards).map((id: string) => Number(id))) + 1 : 1;

		cards[newId] = {
			id: newId,
			enabled: true,
			background: '/images/placeholder.png',
			gaugeValue: 50,
			gauges: [
				{ pid: '0x22F43C', value: 25, unit: '°C', theme: 'Stock' },
				{ pid: '0x010C', value: 60, unit: '', theme: 'Stock' },
				{ pid: '0x0104', value: 1013, unit: 'hPa', theme: 'Stock' }
			],
			alerts: [],
			dynamic: {
				enabled: false,
				pid: '',
				op: '>',
				value: 0,
				priority: 10,
				unit: ''
			}
		};
	}

	function updateCard(id: number, property: keyof View, value: any) {
		(cards[id] as any)[property] = value;
		toast.success('Card updated');
	}

	function addAlert(cardId: any) {
		cards[cardId].alerts.push({
			message: '',
			op: '>',
			pid: '',
			value: 0,
			priority: 0,
			unit: ''
		});
	}

	function updateAlert(
		cardId: number,
		alertIndex: number,
		property: keyof View['alerts'][0],
		value: any
	) {
		(cards[cardId].alerts[alertIndex] as any)[property] = value;
	}

	function updateDynamic(cardId: any, property: string, value: any) {
		(cards[cardId].dynamic as any)[property] = value;
	}
</script>

<div class="flex flex-col justify-center items-center md:w-1/2 w-full mx-auto">
	<div class="grid grid-cols-1 w-full">
		{#if Object.keys(cards).length > 0}
			{#each Object.keys(cards) as id}
				{@const card = cards[id]}

				<Card class="w-full overflow-hidden m-2">
					<CardContent class="p-0 relative">
						<div class="relative w-full h-48">
							<img
								src="images/Background/{card.background}"
								alt="Background"
								class="w-full h-48 object-cover"
							/>
							<img
								src="images/{card.gauges.length > 0 ? card.gauges[0].theme : ''}/preview.png"
								alt="Gauge"
								class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-auto max-w-[200px]"
							/>

							<div class="absolute top-2 right-2">
								<Switch
									checked={card.enabled}
									onchange={(e) => updateCard(card.id, 'enabled', e.target.checked)}
								/>
							</div>
						</div>
						<div class="p-4">
							<div class="space-y-2">
								{#each card.gauges as value}
									<div class="flex justify-between items-center">
										<span>{data.constants.KE_PID[value.pid].shortName}:</span>
										<div class="text-center">
											<span class="font-bold">{value.value}</span>
											<span class="text-sm text-gray-500">{value.unit}</span>
										</div>
									</div>
								{/each}
							</div>

							<div class="mt-4">
								<h3 class="font-bold mb-2">Alerts</h3>
								{#if card.alerts && card.alerts.length !== 0}
									{#each card.alerts as alert, index}
										<div class="flex space-x-2 mb-2">
											<Input
												placeholder="Message"
												value={alert.message}
												onchange={(e) => updateAlert(card.id, index, 'message', e.target.value)}
											/>
											<Select
												value={alert.operator}
												onchange={(value) => updateAlert(card.id, index, 'operator', value)}
											>
												<SelectTrigger class="w-[100px]">
													<SelectValue placeholder="Operator" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value=">">&gt</SelectItem>
													<SelectItem value="<">&lt</SelectItem>
													<SelectItem value="=">=</SelectItem>
												</SelectContent>
											</Select>
											<Input
												placeholder="Parameter"
												value={alert.parameter}
												onchange={(e) => updateAlert(card.id, index, 'parameter', e.target.value)}
											/>
											<Input
												type="number"
												placeholder="Value"
												value={alert.value}
												onchange={(e) =>
													updateAlert(card.id, index, 'value', parseFloat(e.target.value))}
											/>
										</div>
									{/each}
								{/if}
								<Button onclick={() => addAlert(card.id)}>Add Alert</Button>
							</div>

							<div class="mt-4">
								<h3 class="font-bold mb-2">Dynamic</h3>
								<div class="flex items-center space-x-2 mb-2">
									<Switch
										checked={card.dynamic.enabled}
										onchange={(e) => updateDynamic(card.id, 'enabled', e?.target?.checked)}
									/>
									<span>Enabled</span>
								</div>
								{#if card.dynamic && card.dynamic.enabled}
									<div class="space-y-2">
										<Input
											placeholder="Parameter"
											value={card.dynamic.parameter}
											onchange={(e) => updateDynamic(card.id, 'parameter', e?.target?.value)}
										/>
										<Select
											value={card.dynamic.operand}
											onchange={(value) => updateDynamic(card.id, 'operand', value)}
										>
											<SelectTrigger class="w-full">
												<SelectValue placeholder="Operand" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value=">">&gt</SelectItem>
												<SelectItem value="<">&lt</SelectItem>
												<SelectItem value="=">=</SelectItem>
											</SelectContent>
										</Select>
										<Input
											type="number"
											placeholder="Value"
											value={card.dynamic.value}
											onchange={(e) =>
												updateDynamic(card.id, 'value', parseFloat(e?.target?.value))}
										/>
										<Select
											value={card.dynamic.priority}
											onchange={(value) => updateDynamic(card.id, 'priority', value)}
										>
											<SelectTrigger class="w-full">
												<SelectValue placeholder="Priority" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Low">Low</SelectItem>
												<SelectItem value="Medium">Medium</SelectItem>
												<SelectItem value="High">High</SelectItem>
											</SelectContent>
										</Select>
									</div>
								{/if}
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		{/if}
	</div>

	<Button class="mt-6" onclick={addCard}>Add Card</Button>
</div>
