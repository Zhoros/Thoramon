<script>
  export let value;
  export let type;
  export let placeholder;
  let elem;

  $: formattedDate = (() => {
    if (!value) return placeholder || "Select Date";

    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-");

    const dateString = `${day}/${month}/${year}`;

    if (type === "datetime-local" && timePart) {
      return `${dateString} ${timePart}`;
    }

    return dateString;
  })();
</script>

<div style="position: relative; display: flex; flex-direction: column; {$$restProps.style || ''}">
  <button on:click={() => elem.showPicker()} class="outline">
    {formattedDate}
  </button>
  <input
    bind:this={elem}
    bind:value
    on:change
    on:input
    style="visibility: hidden; position: absolute"
    {type}
  />
</div>

