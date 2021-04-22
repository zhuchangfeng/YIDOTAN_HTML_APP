<script >
export default {
	name: 'AnchoredHeading',
	functional: true,
	props: {
		level: {
			type: Number,
			required: true
		}
	},
	render(h, { props, listeners, children, data }) {
		return h(
			'h' + props.level,
			{
				on: {
					click() {
						listeners.show('666')
					}
				},
				class: data.class
			},
			children
		)
	}
}
</script>
