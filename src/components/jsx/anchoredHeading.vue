<<<<<<< HEAD
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
=======
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
>>>>>>> d9854a9668d7b8b2f650720eb7dd09112bdad40f
