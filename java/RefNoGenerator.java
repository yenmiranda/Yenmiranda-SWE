public class RefNoGenerator {

    
    public static String generateRefNo(String userId, int role) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty.");
        }
        if (role != 0 && role != 1) {
            throw new IllegalArgumentException("Role must be 0 (Student) or 1 (Tutor).");
        }
        
        // Ensure the UserID is trimmed and clean before concatenation
        String cleanedUserId = userId.trim();
        
        // Concatenate UserID and Role with a hyphen delimiter
        return cleanedUserId + "-" + role;
    }
    
    // Example Usage:
    /*
    public static void main(String[] args) {
        String tutorRefNo = generateRefNo("000877048", 1);
        System.out.println("Tutor RefNo: " + tutorRefNo); // Output: 000877048-1
        
        String studentRefNo = generateRefNo("987654321", 0);
        System.out.println("Student RefNo: " + studentRefNo); // Output: 987654321-0
    }
    */
}