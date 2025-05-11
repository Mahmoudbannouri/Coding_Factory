import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import io
import base64

def generate_clustering_plots(X, max_clusters=5):
    silhouette_scores = []
    inertias = []
    cluster_range = range(2, max_clusters + 1)

    for k in cluster_range:
        kmeans = KMeans(n_clusters=k, n_init='auto', random_state=42)
        labels = kmeans.fit_predict(X)
        silhouette_scores.append(silhouette_score(X, labels))
        inertias.append(kmeans.inertia_)

    fig, axes = plt.subplots(1, 2, figsize=(14, 6))

    # Silhouette Score plot
    axes[0].plot(cluster_range, silhouette_scores, marker='o')
    axes[0].set_title('Silhouette Score vs Number of Clusters')
    axes[0].set_xlabel('Number of Clusters')
    axes[0].set_ylabel('Silhouette Score')

    # Elbow Method plot
    axes[1].plot(cluster_range, inertias, marker='o')
    axes[1].set_title('Elbow Method (Inertia)')
    axes[1].set_xlabel('Number of Clusters')
    axes[1].set_ylabel('Inertia')

    # Save plot to a BytesIO stream and encode to base64 for web rendering
    img_io = io.BytesIO()
    plt.tight_layout()
    plt.savefig(img_io, format='png')
    img_io.seek(0)
    plot_data = base64.b64encode(img_io.getvalue()).decode()
    plt.close()

    return plot_data
