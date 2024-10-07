<template>
  <SectionWrapper>
    <h2 id="events">Events</h2>
    <p>
      When using a drag and drop library, often it is useful to be able to
      listen to particular events, such as when a drag starts or ends. Event
      listeners can be set at either a global level or at the parent level.
    </p>
    <h3 id="global-events">Global</h3>
    <p>
      Two global events are available, `dragStarted` and `dragEnded`. In order
      to listen to global events, import the <code>state</code> object from
      <code>@formkit/drag-and-drop</code> and register your event listener using
      the <code>on</code> method.
    </p>
    <CodeExample example="events-global" />
    <h3 id="parent-events">Parent</h3>
    <p>
      Parent's themselves have their own set of events that can be listened to.
      These events include: `onDragstart`, `onDragend`, `onSort`, `onTransfer`.
      To listen to parent events, assign a callback function to the event in the
      parent's configuration object.
    </p>
    <CodeExample example="events-parent" />
  </SectionWrapper>
</template>
