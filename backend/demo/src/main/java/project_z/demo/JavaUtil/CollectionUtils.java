package project_z.demo.JavaUtil;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class CollectionUtils {
    private CollectionUtils() {
    }

    public static <T, R> List<R> extractIds(Collection<T> items, Function<T, R> idExtractor) {
        return items.stream()
                .map(idExtractor)
                .filter(Objects::nonNull)
                .toList();
    }

    public static <T, ID> Map<ID, T> toMapById(Collection<T> items, Function<T, ID> idExtractor) {
        return items.stream().collect(Collectors.toMap(idExtractor, Function.identity()));
    }

    public static <T, ID, R> Map<ID, R> toMapById(Collection<T> items, Function<T, ID> idExtractor,
            Function<T, R> valueMapper) {
        return items.stream().collect(Collectors.toMap(idExtractor, valueMapper, (existing, replacement) -> existing));
    }

    public static <T, K> Map<K, List<T>> groupBy(Collection<T> items, Function<T, K> keyExtractor) {
        return items.stream().collect(Collectors.groupingBy(keyExtractor));
    }
}