function updateUserStatus(userId) {
    $.ajax({
      url: `/admin/users/${userId}/block`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ is_blocked: true }),
      success: function() {
        location.reload();
      },
      error: function(xhr, status, error) {
        console.error("Failed to block user", error);
      }
    });
  }
  