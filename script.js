let addedBubblesHistory = []; 
const STORAGE_KEY = 'userBubbles';
function saveBubbles() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(addedBubblesHistory));
        console.log("Bubbles saved to localStorage.");
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
}
function createBubbleHTML(data) {
    let imageElementHtml;
    if (data.imageUrl) {
        imageElementHtml = `<img class="bubble-img" src="${data.imageUrl}" alt="${data.toolName}">`;
    } else {
        imageElementHtml = `<i class="fa fa-plus bubble-img" style="color: #3498db; font-size: 35px;"></i>`;
    }

    return `
        <a href="${data.toolUrl}" target="_blank" class="mr5per new-bubble" id="${data.id}">
            <div class="custom-tool bubble-shaped">
                <div class="custom-tool bubble-container">
                    <div class="img-container bubble-img-container">
                        ${imageElementHtml} 
                    </div>
                    <div class="bubble-title-container">
                        <div class="bubble-title">${data.toolName}</div>
                    </div>
                </div>
            </div>
        </a>
    `;
}
function loadBubbles() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const loadedBubbles = JSON.parse(storedData);
            if (Array.isArray(loadedBubbles)) {
                addedBubblesHistory = loadedBubbles;
                
                const bubbleContainer = document.querySelector('.bubble');
                // Duyệt qua dữ liệu đã tải và chèn HTML
                addedBubblesHistory.forEach(data => {
                    const bubbleHTML = createBubbleHTML(data);
                    bubbleContainer.insertAdjacentHTML('beforeend', bubbleHTML);
                });
                console.log(`Loaded ${addedBubblesHistory.length} bubbles from localStorage.`);
            }
        }
    } catch (e) {
        console.error("Error loading from localStorage", e);
        addedBubblesHistory = [];
    }
}
function updateClock(){
  let now = new Date();
  let second = now.getSeconds();
  let minute = now.getMinutes();
  let hour = now.getHours();
  // Tính góc quay
  document.getElementById("second").style.transform = `rotate(${90 + second * 6 }deg)`;
  document.getElementById("minute").style.transform = `rotate(${90 + minute * 6 }deg)`;
  document.getElementById("hour").style.transform = `rotate(${90 + hour * 30 + (minute/60)*30 }deg)`;
}
setInterval(updateClock,1000);

function showAddBubbleModal() {
    document.getElementById('addBubbleModal').style.display = 'block';
    document.getElementById('toolUrl').focus();
}

function hideAddBubbleModal() {
    document.getElementById('addBubbleModal').style.display = 'none';
    document.getElementById('bubbleForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    // Tải dữ liệu bubble ngay khi DOM được tải
    loadBubbles(); 

    document.getElementById('bubbleForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addBubbleFromForm();
    });
    
    // Thêm event listener cho input tìm kiếm để hiện/ẩn nút xóa và lọc
    document.getElementById('searchInput').addEventListener('input', function() {
        const clearBtn = document.querySelector('.clear-search');
        if (this.value.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
        filterBubbles(); 
    });
});


function addBubbleFromForm() {
    const toolUrl = document.getElementById('toolUrl').value;
    const toolName = document.getElementById('toolName').value;
    const imageUrl = document.getElementById('imageUrl').value;
    
    if (!toolUrl || !toolName) {
        alert("Vui lòng nhập đầy đủ URL và Tên công cụ.");
        return;
    }

    const newBubbleId = `bubble-${Date.now()}`; 
    
    // Tạo đối tượng dữ liệu để lưu trữ
    const newBubbleData = {
        id: newBubbleId,
        toolUrl: toolUrl,
        toolName: toolName,
        imageUrl: imageUrl,
    };

    // 1. Thêm vào DOM
    const bubbleContainer = document.querySelector('.bubble');
    const newBubbleHTML = createBubbleHTML(newBubbleData);
    bubbleContainer.insertAdjacentHTML('beforeend', newBubbleHTML);
    
    // 2. Thêm vào lịch sử (đã được thay đổi để lưu toàn bộ dữ liệu)
    addedBubblesHistory.push(newBubbleData); 
    
    // 3. LƯU VÀO LOCAL STORAGE
    saveBubbles(); 
    
    hideAddBubbleModal();
    console.log(`Đã thêm & lưu tool: ${toolName} (${toolUrl}). ID: ${newBubbleId}`);
}
function deleteBubbleById(bubbleId, bubbleName) {
    const bubbleElement = document.getElementById(bubbleId);
    if (bubbleElement) {
        bubbleElement.remove();
        const indexToRemove = addedBubblesHistory.findIndex(item => item.id === bubbleId);
        if (indexToRemove !== -1) {
            addedBubblesHistory.splice(indexToRemove, 1);
        }
        saveBubbles();
        
        hideUndoSelectionModal();
        alert(`Đã hoàn tác (xóa) bubble: ${bubbleName}.`);
        console.log(`Đã hoàn tác xóa bubble: ${bubbleName} (ID: ${bubbleId})`);
    } else {
        alert("Lỗi: Không tìm thấy phần tử để xóa.");
    }
}

/* --- Hàm Modal Hoàn tác --- */
function showUndoSelectionModal() {
    document.getElementById('undoSelectionModal').style.display = 'block';
}

function hideUndoSelectionModal() {
    document.getElementById('undoSelectionModal').style.display = 'none';
}

/* --- Chức năng Hoàn tác (Undo) --- */
function undoLastBubble() {
    if (addedBubblesHistory.length === 0) {
        alert("Không có bubble nào đã được thêm vào để hoàn tác.");
        return;
    }

    // Trường hợp chỉ có 1 bubble, xóa trực tiếp
    if (addedBubblesHistory.length === 1) {
        const lastBubble = addedBubblesHistory[0];
        deleteBubbleById(lastBubble.id, lastBubble.toolName);
        return;
    }

    const bubbleListContainer = document.getElementById('bubbleListContainer');
    bubbleListContainer.innerHTML = ''; 

    // Hiển thị danh sách 
    const reversedHistory = [...addedBubblesHistory].reverse(); 

    reversedHistory.forEach(item => {
        const button = document.createElement('button');
        button.className = 'bubble-select-btn';
        // Sử dụng item.toolName
        button.innerHTML = `<i class="fa fa-trash"></i> ${item.toolName}`; 
        button.onclick = () => deleteBubbleById(item.id, item.toolName);
        
        bubbleListContainer.appendChild(button);
    });

    showUndoSelectionModal();
}

/* --- Chức năng Tìm Kiếm (Tích hợp) --- */

function clearSearch() {
    document.getElementById('searchInput').value = '';
    // Ẩn nút xóa
    document.querySelector('.clear-search').style.display = 'none';
    filterBubbles(); // Hiển thị lại tất cả bubble
    document.getElementById('searchInput').focus();
}

function filterBubbles() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const bubbleContainer = document.querySelector('.bubble');
    // Chỉ lọc các bubble do người dùng thêm và các bubble mặc định có class mr5per
    const bubbles = bubbleContainer.querySelectorAll('.mr5per');
    const clearBtn = document.querySelector('.clear-search');
    clearBtn.style.display = filter.length > 0 ? 'block' : 'none';

    bubbles.forEach(bubble => {
        const titleElement = bubble.querySelector('.bubble-title');
        if (titleElement) {
            const titleText = titleElement.textContent || titleElement.innerText;
            if (titleText.toUpperCase().indexOf(filter) > -1) {
                bubble.style.display = "inline-block"; 
            } else {
                bubble.style.display = "none"; 
            }
        }
    });
}
