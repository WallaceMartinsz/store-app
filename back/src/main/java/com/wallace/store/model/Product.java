package com.wallace.store.model;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "tb_products")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "id")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String title;
    private double price;
    @Column(length = 2048)
    private String img;

}
