test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
  });

const SERVER_URL = "http://localhost:4000";

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
    title: title,
    content: content,
    }),
  });
  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

// Helper function to post a note with given title and content
async function postNote(title, content) {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
    title: title,
    content: content,
    }),
  });
  const postNotesBody = await postNoteRes.json();
  noteID = postNotesBody.insertedId;

  expect(postNoteRes.status).toBe(200);
  expect(noteID).toBeDefined();

  return noteID;
}

// Helper function to remove all existing notes
async function removeAllNotes() {
  const deleteNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });

  expect(deleteNotesRes.status).toBe(200);
}


test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  await removeAllNotes();

  const getNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });
  const getNotesBody = await getNotesRes.json();

  expect(getNotesRes.status).toBe(200);
  expect(getNotesBody.response).toEqual([]);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  await removeAllNotes();
  
  await postNote("Title 1", "Content 1");
  await postNote("Title 2", "Content 2");

  const getNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });
  const getNotesBody = await getNotesRes.json();

  expect(getNotesRes.status).toBe(200);
  expect(getNotesBody.response.length).toBe(2);
});

test("/deleteNote - Delete a note", async () => {
  noteID = await postNote("Title 1", "Content 1");
  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${noteID}`, {
    method: "DELETE",
  });
  const deleteNoteBody = await deleteNoteRes.json();

  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${noteID} deleted.`);
});

test("/patchNote - Patch with content and title", async () => {
  noteID = await postNote("Title 4", "Content 4");
  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Updated title",
      content: "Updated content",
    }),
  });
  const patchNoteBody = await patchNoteRes.json();

  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${noteID} patched.`);
});

test("/patchNote - Patch with just title", async () => {
  noteID = await postNote("Title 4", "Content 4");
  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Updated title",
    }),
  });
  const patchNoteBody = await patchNoteRes.json();

  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${noteID} patched.`);
});

test("/patchNote - Patch with just content", async () => {
  noteID = await postNote("Title 4", "Content 4");
  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: "Updated content",
    }),
  });
  const patchNoteBody = await patchNoteRes.json();

  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${noteID} patched.`);
});

test("/deleteAllNotes - Delete one note", async () => {
  await removeAllNotes();

  await postNote("Title 123", "Content 934");

  const deleteNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  const deleteNotesBody = await deleteNotesRes.json();

  expect(deleteNotesRes.status).toBe(200);
  expect(deleteNotesBody.response).toBe(`1 note(s) deleted.`);
});

test("/deleteAllNotes - Delete three notes", async () => {
  await removeAllNotes();

  await postNote("Title 1.1", "Content 9.1");
  await postNote("Title 1.2", "Content 9.2");
  await postNote("Title 1.3", "Content 9.3");

  const deleteNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  const deleteNotesBody = await deleteNotesRes.json();

  expect(deleteNotesRes.status).toBe(200);
  expect(deleteNotesBody.response).toBe(`3 note(s) deleted.`);
  
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  noteID = await postNote("Title 1.7", "Content 1.7");
  const updateColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${noteID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      color: "#FF0000",
    }),
  });
  const updateColorBody = await updateColorRes.json();

  expect(updateColorRes.status).toBe(200);
  expect(updateColorBody.message).toBe(`Note color updated successfully.`);
});