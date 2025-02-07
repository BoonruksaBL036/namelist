document.addEventListener("DOMContentLoaded", function () {
  const studentTable = document.getElementById("studentTableBody");
  const studentForm = document.getElementById("studentForm");
  const studentImageInput = document.getElementById("studentImage");
  const studentIdInput = document.getElementById("studentId");
  const studentNameInput = document.getElementById("studentName");
  const updateBtn = document.getElementById("updateBtn"); // ปุ่มอัปเดต

  let students = [];
  let editingIndex = -1; // เก็บ index ของนักเรียนที่กำลังแก้ไข

  // ✅ รายชื่อนักเรียนเริ่มต้น (ใช้ถ้ายังไม่มีข้อมูลใน LocalStorage)
  const defaultStudents = [
    { id: "664259005", name: "นางสาวณัฐกานต์ จำรัสภูมิ", photo: "" },
    { id: "664259006", name: "นางสาวณัฐ์สุดา รงทอง", photo: "" },
    { id: "664259007", name: "นายธนกฤต จันทร์หลง", photo: "" },
    { id: "664259009", name: "นางสาวนับทอง สู่พิพักดิ์", photo: "" },
    { id: "664259010", name: "นายนิติพล สมบัติ", photo: "" },
    { id: "664259012", name: "นายภูมิภัทร บุญประมา", photo: "" },
    { id: "664259015", name: "นายวิศรุต แซ่เล้า", photo: "" },
    { id: "664259019", name: "นายธนกร นนท์ช้าง", photo: "" },
    { id: "664259020", name: "นายธนวัฒน์ ศรีแสง", photo: "" },
    { id: "664259027", name: "นายศุภวิชญ์ สิทธิสูงเนิน", photo: "" },
    { id: "664259032", name: "นายชุติพงษ์ เสือบางพระ", photo: "" },
    { id: "664259033", name: "นายสรรพวัต พัดทอง", photo: "" },
    { id: "664259036", name: "นางสาวบุญรักษา วินานนท์", photo: "" },
  ];

  function loadStudents() {
  const storedStudents = localStorage.getItem("students");

  if (storedStudents && storedStudents !== "[]") {
    students = JSON.parse(storedStudents);
  } else {
    console.log("📌 ไม่มีข้อมูลใน LocalStorage หรือข้อมูลว่าง กำลังเพิ่มค่าเริ่มต้น...");
    students = [...defaultStudents]; // ใช้ spread operator เพื่อป้องกันการแก้ไขต้นฉบับ
    saveStudents(); // ✅ บันทึกค่าเริ่มต้นลง LocalStorage
  }

  renderStudentList(); // ✅ แสดงรายการนักเรียน
}

    renderStudentList(); // ✅ แสดงรายการนักเรียน
  }

  // ✅ บันทึกข้อมูลลง LocalStorage
  function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
  }

  // ✅ แสดงรายการนักเรียน
  function renderStudentList() {
    studentTable.innerHTML = "";
    students.forEach((student, index) => {
      const row = document.createElement("tr");

      // ✅ เพิ่มคอลัมน์สำหรับรูปภาพ
      const cellPhoto = document.createElement("td");
      const img = document.createElement("img");
      img.src =
        student.photo || "https://via.placeholder.com/50/000000/000000?text=+";
      img.classList.add("student-img");
      cellPhoto.appendChild(img);

      const cellId = document.createElement("td");
      cellId.textContent = student.id;

      const cellName = document.createElement("td");
      cellName.textContent = student.name;

      const cellActions = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit");
      editBtn.onclick = () => editStudent(index);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete");
      deleteBtn.onclick = () => deleteStudent(index);

      cellActions.appendChild(editBtn);
      cellActions.appendChild(deleteBtn);

      row.appendChild(cellPhoto);
      row.appendChild(cellId);
      row.appendChild(cellName);
      row.appendChild(cellActions);
      studentTable.appendChild(row);
    });

    saveStudents();
  }

  // ✅ เพิ่มนักเรียนใหม่
  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = studentIdInput.value.trim();
    const name = studentNameInput.value.trim();
    const file = studentImageInput.files[0];

    if (id === "" || name === "") {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        saveStudent(id, name, imageUrl);
      };
      reader.readAsDataURL(file);
    } else {
      saveStudent(id, name, "");
    }
  });

  function saveStudent(id, name, photo) {
    if (editingIndex === -1) {
      // ✅ เพิ่มนักเรียนใหม่
      students.push({ id, name, photo });
    } else {
      // ✅ แก้ไขนักเรียน
      students[editingIndex] = { id, name, photo };
      editingIndex = -1;
      updateBtn.style.display = "none"; // ซ่อนปุ่มอัปเดต
    }

    studentIdInput.value = "";
    studentNameInput.value = "";
    studentImageInput.value = "";
    renderStudentList();
  }

  // ✅ ฟังก์ชันลบนักเรียน
  function deleteStudent(index) {
    if (confirm(`คุณต้องการลบ ${students[index].name} หรือไม่?`)) {
      students.splice(index, 1);
      renderStudentList();
    }
  }

  // ✅ ฟังก์ชันแก้ไขนักเรียน
  function editStudent(index) {
    const student = students[index];
    studentIdInput.value = student.id;
    studentNameInput.value = student.name;
    editingIndex = index;

    updateBtn.style.display = "inline-block"; // แสดงปุ่มอัปเดต
  }

  // ✅ ฟังก์ชันอัปเดตนักเรียน
  updateBtn.addEventListener("click", function () {
    const id = studentIdInput.value.trim();
    const name = studentNameInput.value.trim();
    const file = studentImageInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        saveStudent(id, name, e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      saveStudent(id, name, students[editingIndex].photo);
    }
  });

  // ✅ โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
  loadStudents();
});
