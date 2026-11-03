export const workshop = `# The parcel
A small workshop adventure.
## Make a case
The delivery van is due. I need a case that will keep the contents dry.
**Goals**
- Close the case -- Case[Lid]
- next: Put it away -- Case[Lid] @ Shelf
**Hotspots**
- Shelf
**Items**
- Sheet
- Tool

  This primitive description should never be shown by the text adventure.

- Lid
- Case (compound)
  - slot: closure, accepts Lid

  The folded metal makes a rigid shell.

**Combinations**
- Sheet [transform] + Tool [preserve] -> Case
> NOTE: Never show this private recipe explanation.
## Dispatch
Now address the parcel for its journey.
**Goals**
- Address it -- Parcel
**Items**
- Label
- Parcel

  The address is legible. It is ready to leave.

**Combinations**
- Case[Lid] [transform] + Label [consume] -> Parcel
## Home
The van disappears around the corner.
`;
