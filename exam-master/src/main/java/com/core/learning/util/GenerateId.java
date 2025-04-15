package com.core.learning.util;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;


public class GenerateId {
    private static final AtomicLong counter = new AtomicLong(System.currentTimeMillis());

    // Generate a 15-character alphanumeric ID
    public static String generateUniqueId() {
        String uuid = UUID.randomUUID().toString().replaceAll("-", ""); // Remove dashes
        long seq = counter.incrementAndGet();
        String uniqueId = uuid.substring(0, 10) + String.format("%05d", seq % 100000); // Ensure length = 15
        return uniqueId;
    }

    public static void main(String[] args) {
        System.out.println("Generated ID: " + generateUniqueId());
    }
}

