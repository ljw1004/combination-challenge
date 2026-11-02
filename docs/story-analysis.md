# Story analysis

The [tool instructions](../README.md#story-analysis) cover running the analysis on one Markdown file and generating a comparison table. The [current comparison](../projects/mars-study/story-analysis.md) includes all published stories and Mars v2.

The six-line summary and table use these counting conventions:

1. **Items:** count each different item once. Primitives are supplied ready-made; the others are made through combinations. Adding a component to an existing object does not create another item to count.
2. **Combinations:** include both making new items and adding components to existing objects. The completion count is the number used by the debugger to finish the story.
3. **Chapters:** include every chapter, including the ending.
4. **Chain length:** for each item, find the longest sequence of combinations leading to it, then take the average and maximum across all items. Items requiring no combinations count as zero. Count one chain per item; chains can share earlier steps. Consider the assembled forms that the story asks for.
5. **Chains across chapters:** count items whose history of successive combinations includes work in more than one chapter during the debugger’s playthrough. Count each item once, using its final assembled form.
6. **Items at chapter starts:** count the items on the board when the debugger opens each chapter, including the ending. An assembled object counts as one item. Items left on earlier boards and the landscape itself are excluded. If the debugger skips a requested chapter, count the board it opens instead.

Averages are rounded to one decimal place. The table has one row per number, with secondary numbers indented. The command reports an error if it cannot finish the story or a chain loops back on itself.
