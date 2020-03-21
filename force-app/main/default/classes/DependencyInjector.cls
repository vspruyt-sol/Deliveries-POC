public with sharing class DependencyInjector {
    public static Object instantiate(String className) {
        Type t = Type.forName(className);
        return t.newInstance();
    }
}
