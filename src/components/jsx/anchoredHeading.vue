<script >
export default {
	name: "anchored-heading",
	functional: true,
	props: {
		level: {
			type: Number,
			required: true
		}
	},
	render(h, { props, listeners, children, data }) {
		return h(
			"h" + props.level,
			{
				on: {
					click() {
						listeners.show("666");
					}
				},
				class: data.class
			},
			children
		);
	}
};
</script>