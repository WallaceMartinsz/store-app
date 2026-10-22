package com.wallace.store.config;

import com.wallace.store.model.Category;
import com.wallace.store.model.Product;
import com.wallace.store.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private static final String IMG = "https://images.unsplash.com/%s?w=800&q=80";

    private final ProductRepository repository;

    public DataSeeder(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        repository.saveAll(List.of(
                product("Mouse Sem Fio Aero", "Sensor óptico de 12.000 DPI, 6 botões e bateria para 250 horas.",
                        "249.90", 18, Category.MOUSE, "photo-1527814050087-3793815479db"),
                product("Mouse Gamer Shadow Pro", "Formato ergonômico, switches de 80 milhões de cliques e 58 g.",
                        "389.90", 4, Category.MOUSE, "photo-1615663245857-ac93bb7c39e7"),
                product("Mouse RGB Pulse", "Iluminação RGB personalizável, 11 botões programáveis e cabo trançado.",
                        "199.90", 25, Category.MOUSE, "photo-1563297007-0686b7003af7"),
                product("Teclado Mecânico 75% Orbit", "Switches brown hot-swap, conexão Bluetooth e USB-C.",
                        "549.90", 9, Category.TECLADO, "photo-1618384887929-16ec33fab9ef"),
                product("Teclado Mecânico Retro", "Keycaps PBT coloridas, switches red e layout ABNT2.",
                        "459.90", 12, Category.TECLADO, "photo-1595225476474-87563907a212"),
                product("Teclado Gamer Neon", "Iluminação azul por tecla, anti-ghosting e apoio de pulso.",
                        "299.90", 0, Category.TECLADO, "photo-1612198188060-c7c2a3b66eae"),
                product("Headset Studio X", "Drivers de 50 mm, cancelamento de ruído e almofadas memory foam.",
                        "699.90", 7, Category.HEADSET, "photo-1599669454699-248893623440"),
                product("Headset Bluetooth Wave", "Até 40 horas de bateria, dobrável e microfone embutido.",
                        "429.90", 15, Category.HEADSET, "photo-1505740420928-5e560c06d30e"),
                product("Fone True Wireless Bolt", "Baixa latência para jogos, estojo de carga e resistência IPX4.",
                        "279.90", 3, Category.HEADSET, "photo-1606220588913-b3aacb4d2f46"),
                product("Monitor 27\" IPS QHD", "2560x1440, 165 Hz, 1 ms e bordas finas para múltiplos monitores.",
                        "1899.90", 6, Category.MONITOR, "photo-1586210579191-33b45e38fa2c"),
                product("Microfone Condensador Cast", "Captação cardioide, braço articulado e conexão USB.",
                        "599.90", 10, Category.STREAMING, "photo-1590602847861-f357a9332bbc"),
                product("Webcam Full HD Stream", "1080p a 60 fps, foco automático e microfone estéreo.",
                        "449.90", 8, Category.STREAMING, "photo-1623949556303-b0d17d198863"),
                product("Controle Sem Fio Pro", "Compatível com PC e console, gatilhos analógicos e vibração.",
                        "379.90", 14, Category.ACESSORIO, "photo-1600861194942-f883de0dfe96"),
                product("Caixa de Som Portátil Glow", "Som 360°, luzes RGB e 12 horas de bateria.",
                        "329.90", 11, Category.ACESSORIO, "photo-1589003077984-894e133dabab")
        ));
    }

    private Product product(String name, String title, String price, int quantity, Category category, String photo) {
        Product product = new Product();
        product.setName(name);
        product.setTitle(title);
        product.setPrice(new BigDecimal(price));
        product.setQuantity(quantity);
        product.setCategory(category);
        product.setImg(IMG.formatted(photo));
        return product;
    }
}
